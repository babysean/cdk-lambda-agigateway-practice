import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway'

export class AssignmentBeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * DynamoDB
     * */
    // DynamoDB Table 생성
    const dynamoDB = new dynamodb.Table(this, 'assignment-dynamodb', {
      tableName: 'user',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    });

    /**
     * Lambda
     * */
    const code_path = "../lambda"

    // 테스트용
    const helloLambda = new NodejsFunction(this, 'helloLambda', {
      functionName: "hello-lambda-function",
      entry: path.resolve(__dirname, code_path, 'hello.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_16_X
    })

    // 사용자 정보 insert
    const insertPersonalInformation = new NodejsFunction(this, 'insertPersonalInformation', {
      functionName: "insertPersonalInformation",
      entry: path.resolve(__dirname, code_path, 'insert.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      environment: {
        DYNAMODB_TABLE_NAME: dynamoDB.tableName
      }
    })

    // 사용자 정보 select (한 명)
    const selectPersonalInformation = new NodejsFunction(this, 'selectPersonalInformation', {
      functionName: "selectPersonalInformation",
      entry: path.resolve(__dirname, code_path, 'select.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      environment: {
        DYNAMODB_TABLE_NAME: dynamoDB.tableName
      }
    })

    // 각 Lambda에 DynamoDB read, write 권한 추가
    dynamoDB.grantWriteData(insertPersonalInformation);
    dynamoDB.grantReadData(selectPersonalInformation);

    /**
     * API Gateway
     * */
    const api = new apigateway.RestApi(this, 'assignment-api', {
      restApiName: "Assignment-API-Service",
      description: "Assignment api service",
      deployOptions: {
        stageName: 'v1'
      }
    });

    // Define and Create AWS API Gateway
    const assignmentApi = api.root.addResource("users")

    const testFunction = assignmentApi.addResource("test")
    testFunction.addMethod('POST', new apigateway.LambdaIntegration(helloLambda))

    const manageUserInformation = assignmentApi.addResource("{email}")

    manageUserInformation.addMethod('GET', new apigateway.LambdaIntegration(selectPersonalInformation))

    const insertUserInformation = assignmentApi.addResource("registration")
    insertUserInformation.addMethod('POST', new apigateway.LambdaIntegration(insertPersonalInformation))

    new CfnOutput(this, 'apiUrl', {value: api.url});
  }
}

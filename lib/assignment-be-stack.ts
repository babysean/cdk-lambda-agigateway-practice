import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class AssignmentBeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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

  }
}

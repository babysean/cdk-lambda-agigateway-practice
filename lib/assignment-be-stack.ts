import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class AssignmentBeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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

  }
}

import { APIGatewayEvent, APIGatewayProxyResult, Callback, Context } from "aws-lambda";
import { DynamoDB } from 'aws-sdk'

interface informationInput {
    name: string
    email: string
    phoneNumber: string
    isConsentPersonalInformation: boolean
}

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback): Promise<APIGatewayProxyResult> => {

    const body = event

    if(!body)
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: 'invalid request'
        }

    const { name, email, phoneNumber, isConsentPersonalInformation } = JSON.parse(JSON.stringify(body)) as informationInput

    const dynamo = new DynamoDB.DocumentClient();

    try {
        // data insert
        await dynamo.put({
            TableName: "user",
            Item: {
                name: name,
                email: email,
                phoneNumber: phoneNumber,
                isConsentPersonalInformation: isConsentPersonalInformation
            }
        }).promise()

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: "User information insert complete"
        }

    } catch (err) {
        return {
            statusCode: 500,
            isBase64Encoded: false,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: err
        }
    }
}
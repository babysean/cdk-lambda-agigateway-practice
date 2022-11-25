import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk'

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {

    let userEmail = JSON.parse(JSON.stringify(event)).email ? JSON.parse(JSON.stringify(event)).email : JSON.parse(JSON.stringify(event.pathParameters)).email

    if(!userEmail)
        return {
            statusCode: 500,
            isBase64Encoded: false,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: "Internal Server Error"
        }

    const dynamo = new DynamoDB.DocumentClient();

    try {
        const item = await dynamo.get({
            TableName: "user",
            Key: {
                email: userEmail
            }
        }).promise();

        return {
            statusCode: 200,
            isBase64Encoded: false,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item.Item)
        }
    } catch (err) {
        return {
            statusCode: 500,
            isBase64Encoded: false,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(err)
        }
    }
}
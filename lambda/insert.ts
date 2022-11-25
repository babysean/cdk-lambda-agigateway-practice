import { APIGatewayEvent, APIGatewayProxyResult, Callback, Context } from "aws-lambda";
import { DynamoDB } from 'aws-sdk'

interface informationInput {
    name: string
    email: string
    phoneNumber: string
    isConsentPersonalInformation: boolean
}

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {

    let body = event

    // API Gateway의 호출일 때, event.body에 파라미터 존재
    if(event.body)
        body = JSON.parse(event.body)

    if(!body && event.body)
        callback(null, {
            statusCode: 500,
            isBase64Encoded: false,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: 'invalid request'
        })

    const dynamo = new DynamoDB.DocumentClient();

    const { name, email, phoneNumber, isConsentPersonalInformation } = JSON.parse(JSON.stringify(body)) as informationInput

    try {
        // data insert
        const item = await dynamo.put({
            TableName: "user",
            Item: {
                name: name,
                email: email,
                phoneNumber: phoneNumber,
                isConsentPersonalInformation: isConsentPersonalInformation
            }
        }).promise()

        callback(null, {
            statusCode: 200,
            isBase64Encoded: false,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: "Insert complete"
        })
    } catch (err) {
        callback(null, {
            statusCode: 500,
            isBase64Encoded: false,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(err)
        })
    }
}
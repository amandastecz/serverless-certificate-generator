import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamoDBClient";

interface IUserCertificate{
    name: string;
    id: string;
    created_at: string;
    grade: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const {id} = event.pathParameters;
    const response = await document.query({
        TableName: "users_certificate",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues:{
            ":id": id
        }
    }).promise();
    const userCertificate = response.Items[0] as IUserCertificate;
    if(userCertificate){
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Certificado válido",
                name: userCertificate.name,
                url: `https://serverless-certificate-generator.s3.us-east-1.amazonaws.com/${id}.pdf`
            })
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "Certificado inválido"
        })
    }
}
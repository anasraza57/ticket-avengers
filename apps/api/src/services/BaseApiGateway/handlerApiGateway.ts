import { APIGatewaySimpleAuthorizerResult } from 'aws-lambda';
export async function cookieAuthorizer(): Promise<APIGatewaySimpleAuthorizerResult> {

    // TODO: check if the cookie is present and access token is valid
    return {
        isAuthorized: true
    }

}
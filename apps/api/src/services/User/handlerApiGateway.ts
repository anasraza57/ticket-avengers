import { APIGatewayEvent } from 'aws-lambda'
import { RestApi } from '@driven-app/shared-types/api'
import * as Service from './service'
import httpErrorHandler from '../../utilities/httpErrorHandler'

export async function login(event: APIGatewayEvent) {
    if (!event.body) {
        return {
               statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing body'
                })
        }
    }

    let rawBody = event.body

    if (event.isBase64Encoded) {
        rawBody = Buffer.from(rawBody, 'base64').toString()
    }

    const credentials = JSON.parse(rawBody) as RestApi.User.LoginRequest

    try {
        const userAuth = await Service.generateAuthTokens(credentials)

        const responseBody: RestApi.User.LoginResponse = {
            userId: userAuth.userId,
            expiresIn: userAuth.expiresIn
        }

        return {
            statusCode: 200,
            body: JSON.stringify(responseBody),
            cookies: [
                // The Set-Cookie header tells the browser to persist the access token in the cookie store
                `accessToken=${userAuth.accessToken}; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age: ${userAuth.expiresIn}`,
                `refreshToken=${userAuth.refreshToken}; Secure; HttpOnly; SameSite=Lax; Path=/;` // TODO: set max-age based on Cognito config
            ]
        }
    } catch (error) {
        return httpErrorHandler(error)
    }
}

export async function logout() {
    return {
        isBase64Encoded: false,
        statusCode: 204,
        cookies: [
            // setting the max-age to -1 will tell the browser to delete the cookie
            `accessToken=n/a; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age: -1`,
            `refreshToken=n/a; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age: -1`
        ]
    }
}

export async function create(event: APIGatewayEvent) {
    if (!event.body) {
        if (!event.body) {
            return {
                   statusCode: 400,
                    body: JSON.stringify({
                        message: 'Missing body'
                    })
            }
        }
    }

    let rawBody = event.body

    if (event.isBase64Encoded) {
        rawBody = Buffer.from(rawBody, 'base64').toString()
    }

    const attributes = JSON.parse(rawBody) as RestApi.User.CreateRequest

    try {
        const user = await Service.createUser(attributes)
        return user
    } catch (error) {
        return httpErrorHandler(error)
    }
}
import { APIGatewayProxyEventV2, APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda'
import { RestApi } from '@driven-app/shared-types/api'
import * as Service from './service'
import httpErrorHandler from '../../utilities/httpErrorHandler'
import formatAuthCookies from '../../utilities/formatAuthCookies'
import getRequesterFromEvent from '../../utilities/getRequesterFromEvent'

export async function login(event: APIGatewayProxyEventV2) {
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
            // The Set-Cookie header tells the browser to persist the access token in the cookie store
            cookies: formatAuthCookies(userAuth)
        }
    } catch (error) {
        return httpErrorHandler(error)
    }
}

export async function refresh(event: APIGatewayProxyEventV2WithLambdaAuthorizer<RestApi.AuthorizationContext>) {

    const refreshToken = event.cookies?.find(cookie => cookie.startsWith('refreshToken'))?.split('=')[1] || ''
    const accessToken = event.cookies?.find(cookie => cookie.startsWith('accessToken'))?.split('=')[1] || ''
    const idToken = event.cookies?.find(cookie => cookie.startsWith('idToken'))?.split('=')[1] || ''
    
    const requester = getRequesterFromEvent(event)

    try {
        const userAuth = await Service.refreshAuthToken({
            tokens: {
                refreshToken: refreshToken,
                accessToken: accessToken,
                idToken: idToken
            },
            requester: requester
        })

        const responseBody: RestApi.User.LoginResponse = {
            userId: userAuth.userId,
            expiresIn: userAuth.expiresIn
        }

        return {
            statusCode: 200,
            body: JSON.stringify(responseBody),
            // The Set-Cookie header tells the browser to persist the access token in the cookie store
            cookies: formatAuthCookies(userAuth)
        }
    } catch (error) {
        return httpErrorHandler(error)
    }
}

export async function logout() {
    return {
        isBase64Encoded: false,
        statusCode: 204,
        // The Set-Cookie header tells the browser to persist the access token in the cookie store
        cookies: formatAuthCookies({ expiresIn: -1 })
    }
}

export async function create(event: APIGatewayProxyEventV2) {
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
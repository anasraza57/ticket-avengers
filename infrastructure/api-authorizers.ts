import { APIGatewaySimpleAuthorizerWithContextResult, APIGatewayRequestAuthorizerEventV2 } from 'aws-lambda'
import { createTokenVerifier } from '../libs/aws-clients/src/Cognito'
import { RestApi } from '../libs/shared-types/api'


const userPoolId = process.env.userPoolId as string
const userPoolClientId = process.env.userPoolClientId as string

const accessTokenVerifier = createTokenVerifier({
    userPoolId: userPoolId,
    clientId: userPoolClientId,
    tokenUse: 'access'
})

const idTokenVerifier = createTokenVerifier({
    userPoolId: userPoolId,
    clientId: userPoolClientId,
    tokenUse: 'id'
})

/**
 * Authorizes the API Gateway request using cookies.
 * 
 * If you need to debug this, make sure to disable the authorizer caching in the API Gateway by setting `resultsCacheTtl` to
 *  '0 minutes' in `infrastructure/api-gateway.ts`.
 * 
 * @param event - The APIGatewayRequestAuthorizerEventV2 object representing the incoming request.
 * @returns An object containing a boolean indicating whether the token is valid and an authorization context object.
 */
export async function cookieAuthorizer(event: APIGatewayRequestAuthorizerEventV2): Promise<APIGatewaySimpleAuthorizerWithContextResult<RestApi.AuthorizationContext>> {

    const cookies = event.cookies
    const accessToken = cookies.find(cookie => cookie.startsWith('accessToken'))?.split('=')[1] || '' 
    const idToken = cookies.find(cookie => cookie.startsWith('idToken'))?.split('=')[1] || '' 

    let accessTokenContent, idTokenContent

    try {
        if (accessToken && idToken) {
            accessTokenContent = await accessTokenVerifier.verify(accessToken, { clientId: userPoolClientId,  })
            idTokenContent = await idTokenVerifier.verify(idToken, { clientId: userPoolClientId,  })
        }
    }  catch (error) {
        console.error('failed to verify the token: ', error)
    }

    const groups = idTokenContent ? idTokenContent['cognito:groups'] || [] : []
    const userId = idTokenContent ? idTokenContent['cognito:username'] : ''

    return {
        isAuthorized: isValidToken({ accessToken: accessTokenContent, idToken: idTokenContent }),
        context: {
            userId: userId,
            email: idTokenContent?.email,
            phone: idTokenContent?.phone_number,
            firstName: idTokenContent?.given_name,
            lastName: idTokenContent?.family_name,
            groups: groups.join(',')
        }
    }
}

function isValidToken({ accessToken, idToken }) {
    const clientIdMatches = accessToken?.client_id === idToken?.aud && accessToken?.client_id === userPoolClientId && idToken?.aud === userPoolClientId
    const tokenIsNotExpired = accessToken?.exp > (Date.now() / 1000) && idToken?.exp > (Date.now() / 1000)

    return clientIdMatches && tokenIsNotExpired
}
import * as DAL from './dataAccess'
import { CognitoClient, AdminInitiateAuthCommand, createTokenVerifier } from '@driven-app/aws-clients/Cognito'
import { environment } from '../../configuration/environment'
import { parsePhoneNumber } from 'awesome-phonenumber'
import errorCodes from '../../configuration/errorCodes'
import * as emailValidator from 'email-validator'
import { RestApi } from '@driven-app/shared-types/api'

type GenerateAuthTokens = {
    email?: string
    phone?: string
    password: string
}

type CreateUserInput = {
    email: string
    phone: string
    password: string
    firstName: string
    lastName: string
    groups?: string[]
}

type RefreshAuthTokens = {
    tokens: {
        refreshToken: string
        accessToken: string
        idToken: string
    },
    requester?: RestApi.Requester
}

/**
 * Generates authentication tokens for a user based on their credentials.
 * @param credentials - The user's credentials (email, phone, and password).
 * @returns An object containing the generated authentication tokens.
 * @throws {errorCodes.USER.MISSING_EMAIL_OR_PHONE} If no email or phone is provided in the credentials.
 * @throws {errorCodes.USER.NOT_FOUND} If the user is not found.
 * @throws {errorCodes.USER.NOT_ACTIVE} If the user is not active.
 */
export async function generateAuthTokens(credentials: GenerateAuthTokens) {

    let user
    if (credentials.email) {
        user = await DAL.findByEmail(credentials.email)
    } else if (credentials.phone) {
        user = await DAL.findByPhone(credentials.phone)
    } else {
        console.error('no email or phone provided')
        throw errorCodes.USER.MISSING_EMAIL_OR_PHONE
    }

    if (!user) {
        console.error(`User not found: ${credentials.email || credentials.phone}`)
        throw errorCodes.USER.NOT_FOUND
    }

    if (!user.isActive) {
        console.error(`User is not active: ${credentials.email || credentials.phone}`)
        throw errorCodes.USER.NOT_ACTIVE
    }

    const cognitoPayload = new AdminInitiateAuthCommand({
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        ClientId: environment.cognito.userPoolClientId,
        UserPoolId: environment.cognito.userPoolId,
        AuthParameters: {
            USERNAME: user.id,
            PASSWORD: credentials.password,
        }
    })

    const cognitoResponse = await CognitoClient.send(cognitoPayload)
    
    return {
        userId: user.id,
        expiresIn: cognitoResponse.AuthenticationResult?.ExpiresIn || 0,
        accessToken: cognitoResponse.AuthenticationResult?.AccessToken,
        refreshToken: cognitoResponse.AuthenticationResult?.RefreshToken,
        idToken: cognitoResponse.AuthenticationResult?.IdToken
    }

}

export async function refreshAuthToken({ tokens: { refreshToken, accessToken, idToken }, requester }: RefreshAuthTokens) {

    console.log(requester)

    const tokenVerifier = createTokenVerifier({
        userPoolId: environment.cognito.userPoolId,
        clientId: environment.cognito.userPoolClientId
    })

    const tokenContent = await tokenVerifier.verify(accessToken, { clientId: environment.cognito.userPoolClientId })
    const userId = tokenContent['username'] as string

    const expirationThreshold = 2 * 60 // 2 minutes
    const expiration = tokenContent.exp // the expiration date, in seconds
    const now = Date.now() / 1000 // convert to seconds
    const timeLeftOntToken = Math.floor(expiration - now)
    const isAccessTokenAlmostExpired = timeLeftOntToken <= expirationThreshold

    let expiresIn, newAccessToken, newRefreshToken, newIdToken

    if (!isAccessTokenAlmostExpired) {
        console.log(`access token not close to expiration, it still has [${timeLeftOntToken}] seconds left`)

        expiresIn = timeLeftOntToken,
        newAccessToken = accessToken,
        newRefreshToken = refreshToken,
        newIdToken = idToken
    } else {
        console.log(`access token within the expiration threshold`)

        const cognitoPayload = new AdminInitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: environment.cognito.userPoolClientId,
            UserPoolId: environment.cognito.userPoolId,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken
            }
        })
    
        const cognitoResponse = await CognitoClient.send(cognitoPayload)
    
        expiresIn =  cognitoResponse.AuthenticationResult?.ExpiresIn || 0,
        newAccessToken = cognitoResponse.AuthenticationResult?.AccessToken,
        newRefreshToken = cognitoResponse.AuthenticationResult?.RefreshToken,
        newIdToken = cognitoResponse.AuthenticationResult?.IdToken
    }

    return {
        userId: userId,
        expiresIn: expiresIn,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        idToken: newIdToken
    }

}

/**
 * Creates a new user with the given attributes.
 * @param attributes - The attributes of the user to create.
 * @returns The created user.
 * @throws {Error} If the phone number is invalid or the email is invalid.
 */
export async function createUser(attributes: CreateUserInput) {
    const parsedPhoneNumber = parsePhoneNumber(attributes.phone, { regionCode: 'US' })
    const isValidEmail = emailValidator.validate(attributes.email)
    
    if (!parsedPhoneNumber.valid) {
        console.error(`invalid phone number: ${attributes.phone}}`)
        throw errorCodes.USER.INVALID_PHONE
    }

    if (!isValidEmail) {
        console.error(`invalid email: ${attributes.email}`)
        throw errorCodes.USER.INVALID_EMAIL
    }

    const newUserRecord = {
        ...attributes,
        phone: parsedPhoneNumber.number.e164
    }

    const user = await DAL.create(newUserRecord)
    
    return user
}
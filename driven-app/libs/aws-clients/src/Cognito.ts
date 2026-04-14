import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { CognitoJwtVerifier } from "aws-jwt-verify"

export const CognitoClient = new CognitoIdentityProviderClient({ region: "us-east-1", maxAttempts: 3 });
export * from '@aws-sdk/client-cognito-identity-provider'


type CognitoJwtVerifierOptions = { 
    userPoolId: string
    clientId: string
    tokenUse?: 'id' | 'access'
}

export function createTokenVerifier({ userPoolId, clientId, tokenUse }: CognitoJwtVerifierOptions) {
    // Create the verifier outside the Lambda handler (= during cold start),
    // so the cache can be reused for subsequent invocations. Then, only during the
    // first invocation, will the verifier actually need to fetch the JWKS.
    const tokenVerifier = CognitoJwtVerifier.create({
        userPoolId: userPoolId,
        tokenUse: tokenUse || "access",
        clientId: clientId
    })

  return tokenVerifier
}
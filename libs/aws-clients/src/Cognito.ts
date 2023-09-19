import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'

export const CognitoClient = new CognitoIdentityProviderClient({ region: "us-east-1", maxAttempts: 3 });
export * from '@aws-sdk/client-cognito-identity-provider'
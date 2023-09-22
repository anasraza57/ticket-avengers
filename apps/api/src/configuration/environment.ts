const IS_PRODUCTION = process.env['IS_PRODUCTION'] === 'true'
const IS_OFFLINE = process.env['IS_OFFLINE'] === 'true'

export const environment = {
  production: IS_PRODUCTION,
  offline: IS_OFFLINE,
  cognito: {
    userPoolId: process.env['cognitoUserPoolId'] as string,
    userPoolArn: process.env['cognitoUserPoolArn'] as string,
    userPoolClientId: process.env['cognitoUserPoolClientId'] as string
  },
  dynamodb: {
    tableNamePrefix: process.env['dynamodbTableNamePrefix'] as string
  },
};

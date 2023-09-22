import { StackContext, use, Table, Permissions } from 'sst/constructs';
import { API } from '@driven-app/infrastructure/api-gateway'
import { AuthCognito } from '@driven-app/infrastructure/cognito'
import { RemovalPolicy } from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'

const fullPathToHandler = './apps/api/src/services/User/handlerApiGateway'

export function UserApiRoutes({ stack }: StackContext) {
    const { api } = use(API)
    const { userTable } = use(UserTable)
    const { cognito } = use(AuthCognito)

    api.addRoutes(stack, {
        'POST /users': {
            authorizer: 'none',
            function: {
                handler: `${fullPathToHandler}.create`,
                environment: {
                    cognitoUserPoolId: cognito.userPoolId,
                    cognitoUserPoolArn: cognito.userPoolArn,
                    cognitoUserPoolClientId: cognito.userPoolClientId
                },
                permissions: [
                    userTable,
                    new iam.PolicyStatement({
                        actions: ['cognito-idp:AdminCreateUser', 'cognito-idp:AdminAddUserToGroup', 'cognito-idp:AdminSetUserPassword'],
                        resources: [cognito.userPoolArn],
                        effect: iam.Effect.ALLOW
                    }) as unknown as Permissions[0]
                ]
            }
        },
        'POST /users/login': {
            authorizer: 'none',
            function: {
                handler: `${fullPathToHandler}.login`,
                environment: {
                    cognitoUserPoolId: cognito.userPoolId,
                    cognitoUserPoolArn: cognito.userPoolArn,
                    cognitoUserPoolClientId: cognito.userPoolClientId
                },
                permissions: [
                    userTable,
                    new iam.PolicyStatement({
                        actions: ['cognito-idp:AdminInitiateAuth'],
                        resources: [cognito.userPoolArn],
                        effect: iam.Effect.ALLOW
                    }) as unknown as Permissions[0]
                ]
            }
        },
        'PUT /users/login': {
            function: {
                handler: `${fullPathToHandler}.refresh`,
                environment: {
                    cognitoUserPoolId: cognito.userPoolId,
                    cognitoUserPoolArn: cognito.userPoolArn,
                    cognitoUserPoolClientId: cognito.userPoolClientId
                },
                permissions: [
                    userTable,
                    new iam.PolicyStatement({
                        actions: ['cognito-idp:AdminInitiateAuth'],
                        resources: [cognito.userPoolArn],
                        effect: iam.Effect.ALLOW
                    }) as unknown as Permissions[0]
                ]
            }
        },
        'DELETE /users/login': {
            authorizer: 'none',
            function: {
                handler: `${fullPathToHandler}.logout`
            }
        }
    })
}

export function UserTable({ stack }: StackContext) {
    const userTable = new Table(stack, 'Users', {
        fields: {
            id: 'string'
        },
        primaryIndex: { partitionKey: 'id' },
        globalIndexes: {},
        cdk: {
            table: {
                tableName: `${stack.stage}-Users`,
                // removalPolicy: RemovalPolicy.SNAPSHOT
                removalPolicy: RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE
            }
        }
    })

    return {
        userTable,
        UserApiRoutes
    }
}
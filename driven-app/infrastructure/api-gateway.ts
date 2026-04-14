import { StackContext, Api, Function, use } from 'sst/constructs'
import { AuthCognito } from './cognito'

export function API({ stack }: StackContext) {

    const { cognito } = use(AuthCognito)

    const api = new Api(stack, 'HttpApi', {
        cors: {
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowHeaders: ['*'],
            allowOrigins: ['*']
        },
        authorizers: {
            cookieAuthorizer: {
                type: 'lambda',
                resultsCacheTtl: '10 minutes',
                responseTypes: ['simple'],
                identitySource: ['$request.header.Cookie'],
                name: 'cookieAuthorizer',
                function: new Function(stack, 'CookieAuthorizer', {
                    handler: './infrastructure/api-authorizers.cookieAuthorizer',
                    description: 'Authorizer for cookie-based authentication',
                    environment: {
                        userPoolId: cognito.userPoolId,
                        userPoolArn: cognito.userPoolArn,
                        userPoolClientId: cognito.userPoolClientId
                    },
                    permissions: []
                })
            }
        },
        defaults: {
            authorizer: 'cookieAuthorizer'
        },
        cdk: {
            httpApi: {
                createDefaultStage: false
            },
            // this 'stage' is so that the URL has `/api` at the end
            httpStages: [{
                stageName: 'api',
                autoDeploy: true
            }]
        }
    })

    return {
        api
    }
}
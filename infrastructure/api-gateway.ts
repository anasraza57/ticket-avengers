import { StackContext, Api, Function } from 'sst/constructs'

export function API({ stack }: StackContext) {
    const api = new Api(stack, 'HttpApi', {
        cors: {
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowHeaders: ['*'],
            allowOrigins: ['*']
        },
        authorizers: {
            cookieAuthorizer: {
                type: 'lambda',
                resultsCacheTtl: '15 minutes',
                responseTypes: ['simple'],
                identitySource: ['$request.header.Cookie'],
                name: 'cookieAuthorizer',
                function: new Function(stack, 'CookieAuthorizer', {
                    handler: './infrastructure/api-authorizers.cookieAuthorizer',
                    description: 'Authorizer for cookie-based authentication'
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

    stack.addOutputs({
        RestApiUrl: {
            value: api.url,
            exportName: 'RestApiUrl'
        }
    })

    return {
        api
    }
}
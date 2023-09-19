import commonConfig, { ExtendedConfig } from '../serverless.base'

const serverlessConfiguration: ExtendedConfig = {
  service: 'BaseRestApi',

  package: commonConfig.package,
  plugins: commonConfig.plugins,
  provider: {
    ...commonConfig.provider,
    httpApi: undefined, // override httpApi config from base serverless config  
    apiGateway: undefined // override apiGateway config from base serverless config
  },

  functions: {
    cookieAuthorizer: {
        handler: './handlerApiGateway.cookieAuthorizer'
    }
  },

  resources: {
    Description: 'Shared API Gateway for REST API',
    Resources: {

        RestApiGateway: {
            Type: 'AWS::ApiGatewayV2::Api',
            Properties: {
                Name: 'RestApiGateway',
                Description: 'Shared API Gateway for REST API',
                ProtocolType: 'HTTP',
                CorsConfiguration: {
                    AllowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                    AllowHeaders: ['*'],
                    AllowOrigins: ['*'],
                }
            }      
        },

        CookieAuthorizerLambdaAuthorizerPermissionRestApi: {
        Type: "AWS::Lambda::Permission",
        Properties: {
            FunctionName: {
            "Fn::GetAtt": ["CookieAuthorizerLambdaFunction", "Arn"]
            },
            "Action": "lambda:InvokeFunction",
            "Principal": "apigateway.amazonaws.com",
            "SourceArn": {
            "Fn::Join": ["", ["arn:", {
                "Ref": "AWS::Partition"
            }, ":execute-api:", {
                "Ref": "AWS::Region"
            }, ":", {
                "Ref": "AWS::AccountId"
            }, ":", {
                "Ref": "RestApiGateway"
            }, "/*"]]
            }
        }
    },

        RestApiGatewayDefaultStage: {
            Type: 'AWS::ApiGatewayV2::Stage',
            Properties: {
                ApiId: {
                    Ref: 'RestApiGateway'
                },
                AutoDeploy: true,
                StageName: '$default'
            }
        },

        RestApiGatewayCookieAuthorizer: {
            Type: 'AWS::ApiGatewayV2::Authorizer',
            Properties: {
                Name: 'RestApiGatewayCookieAuthorizer',
                ApiId: {
                    Ref: 'RestApiGateway'
                },
                AuthorizerType: 'REQUEST',
                AuthorizerUri: {
                    "Fn::Join": ["", ["arn:", {
                        "Ref": "AWS::Partition"
                    }, ":apigateway:", {
                        "Ref": "AWS::Region"
                    }, ":lambda:path/2015-03-31/functions/", {
                        "Fn::GetAtt": ["CookieAuthorizerLambdaFunction", "Arn"]
                    }, "/invocations"]]
                },

                AuthorizerPayloadFormatVersion: '2.0',
                AuthorizerResultTtlInSeconds: 1,
                EnableSimpleResponses: true,
                IdentitySource: ['$request.header.auth']
            }
        },

    },
    Outputs: {
        restApiId: {
            Value: {
                Ref: 'RestApiGateway'
            }
        },
        restApiCookieAuthorizerId: {
            Value: {
                Ref: 'RestApiGatewayCookieAuthorizer'
            }
        }
    }
  },

}

module.exports = serverlessConfiguration

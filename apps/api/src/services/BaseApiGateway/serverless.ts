import commonConfig, { ExtendedConfig } from '../serverless.base'

const serverlessConfiguration: ExtendedConfig = {
  service: 'BaseRestApi',

  package: commonConfig.package,
  plugins: commonConfig.plugins,
  provider: {
    ...commonConfig.provider,
    apiGateway: undefined // override apiGateway config from base serverless config
  },

  resources: {
    Description: 'Shared API Gateway for REST API',
    Resources: {
        BaseApiGateway: {
            Type: 'AWS::ApiGateway::RestApi',
            Properties: {
                Name: 'BaseApiGateway',
                Description: 'Shared API Gateway for REST API',
                EndpointConfiguration: {
                    Types: [
                        'REGIONAL'
                    ]
                }
            }
        }
    },
    Outputs: {
        restApiId: {
            Value: {
                Ref: 'BaseApiGateway'
            }
        },
        restApiRootResourceId: {
            Value: {
                'Fn::GetAtt': [
                    'BaseApiGateway',
                    'RootResourceId'
                ]
            }
        }
    }
  },

}

module.exports = serverlessConfiguration

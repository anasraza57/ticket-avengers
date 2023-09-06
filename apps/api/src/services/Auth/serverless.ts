import commonConfig, { ExtendedConfig } from '../serverless.base'

const serverlessConfiguration: ExtendedConfig = {
  service: 'Auth',

  resources: {
    Description: 'REST Auth service',
  },

  package: commonConfig.package,
  plugins: commonConfig.plugins,
  provider: commonConfig.provider,

  functions: {
    foo: {
        handler: './handlers.foo',
        events: [
            {
                http: {
                    method: 'get',
                    path: '/foo'
                }
            }
        ]
    }
  }
}

module.exports = serverlessConfiguration

import type { AWS } from '@serverless/typescript'

export type ExtendedConfig = AWS & object

const commonConfig: AWS  = {
  service: '_common',

  frameworkVersion: '3',

  //Configuration validation: 'error' (fatal error), 'warn' (logged to the output) or 'off' (default: warn)
  // See https://www.serverless.com/framework/docs/configuration-validation
  configValidationMode: 'error',
  

  package: {
    individually: true,
  },

  plugins: [
    'serverless-offline',
    'serverless-iam-roles-per-function',
    // 'serverless-iamroles',
    'serverless-esbuild',
  ],

  provider: {
    name: 'aws',
    runtime: "nodejs18.x",
    logRetentionInDays: 14,
    versionFunctions: false,
    deploymentMethod: 'direct',
    endpointType: 'regional',
    httpApi: {
      payload: '2.0',
      id: '${param:restApiId}'
    },
    stackName: 'restapi-${self:service}-${opt:stage, self:provider.stage}',
    profile: '964002935850_AdministratorAccess'
  },

  custom: {
    bundle: {
      esbuild: true,
      sourcemaps: false,
      linting: false,
      tsConfig: './tsconfig.json',
    },

    serverlessOffline: {
        httpPort: 3333,
        lambdaPort: 2333,
        noPrependStageInUrl: true
    }
  }
}

export default commonConfig

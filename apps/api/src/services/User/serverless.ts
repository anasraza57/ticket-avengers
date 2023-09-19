import commonConfig, { ExtendedConfig } from '../serverless.base'

const basePath = '/users'

const serverlessConfiguration: ExtendedConfig = {
  service: 'User',

  package: commonConfig.package,
  plugins: commonConfig.plugins,
  provider: {
    ...commonConfig.provider,
    environment: {
      ...commonConfig.provider?.environment,
      cognitoUserPoolId: {
        Ref: 'CognitoUserPool'
      },
      cognitoUserPoolArn: {
        'Fn::GetAtt': ['CognitoUserPool', 'Arn']
      },
      cognitoUserPoolClientId: {
        Ref: 'CognitoUserPoolClient'
      }
    }
  },

  functions: {
    login: {
        handler: './handlerApiGateway.login',
        events: [
            {
                httpApi: {
                    method: 'post',
                    path: `${basePath}/login`
                }
            }
        ],
        // @ts-ignore: custom property from serverless-iam-roles-per-function plugin
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Resource: {
                    'Fn::GetAtt': ['CognitoUserPool', 'Arn']
                },
                Action: [
                    'cognito-idp:AdminInitiateAuth'
                ]
            },
            {
                Effect: 'Allow',
                Resource: {
                    'Fn::GetAtt': ['UsersTable', 'Arn']
                },
                Action: ['dynamodb:GetItem']
            }
        ]
    },
    logout: {
        handler: './handlerApiGateway.logout',
        events: [
            {
              httpApi: {
                    method: 'delete',
                    path: `${basePath}/logout`,
                    authorizer: {
                      type: 'request',
                      id: '${param:restApiCookieAuthorizerId}'
                    }
                }
            }
        ]
    },
    create: {
        handler: './handlerApiGateway.create',
        events: [
            {
              httpApi: {
                    method: 'post',
                    path: `${basePath}`
                }
            }
        ],
        // @ts-ignore: custom property from serverless-iam-roles-per-function plugin
        iamRoleStatements:[
            {
                Effect: 'Allow',
                Resource: {
                  'Fn::GetAtt': ['CognitoUserPool', 'Arn']
              },
                Action: [
                    'cognito-idp:AdminCreateUser',
                    'cognito-idp:AdminDisableUser',
                    'cognito-idp:AdminDeleteUser',
                    'cognito-idp:AdminAddUserToGroup',
                    'cognito-idp:AdminSetUserPassword',
                ]
            },
            {
                Effect: 'Allow',
                Resource: {
                  'Fn::GetAtt': ['UsersTable', 'Arn']
              },
                Action: [
                  'dynamodb:PutItem', 
                  'dynamodb:GetItem', 
                  'dynamodb:DeleteItem', 
                  'dynamodb:TransactWriteItems'
                ]
            }
        ]
    }
  },

  resources: {
    Description: 'User service for REST API',
    Resources: {
      UsersTable: {
        Type: 'AWS::DynamoDB::Table',
        // DeletionPolicy: 'Retain',
        Properties: {
          TableName: 'Users',
          BillingMode: 'PAY_PER_REQUEST',
          PointInTimeRecoverySpecification: {
            PointInTimeRecoveryEnabled: true
          },
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
          ],
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            }
          ]
        }

      },

      CognitoUserPool: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
          // DeletionProtection: 'ACTIVE',
          UserPoolName: 'Driven_Users',
          // AutoVerifiedAttributes: ['email', 'phone_number'],

          AccountRecoverySetting: {
            RecoveryMechanisms: [
              // {
              //   Name: 'verified_phone_number',
              //   Priority: 1
              // },
              {
                Name: 'verified_email',
                Priority: 1
              },
            ],
          },

          UsernameConfiguration: { CaseSensitive: false },

          Policies: {
            PasswordPolicy: {
              MinimumLength: 8,
              RequireLowercase: true,
              RequireNumbers: true,
              RequireSymbols: true,
              RequireUppercase: false,
              TemporaryPasswordValidityDays: 7,
            }
          },

          AdminCreateUserConfig: {
            AllowAdminCreateUserOnly: true
          },

          Schema: [
            {
              AttributeDataType: 'String',
              Mutable: true,
              Name: 'phone_number',
              Required: true
            },
            {
              AttributeDataType: 'String',
              Mutable: true,
              Name: 'email',
              Required: true
            }
          ]
        }
      },

      UserGroupMotorist: {
        Type: 'AWS::Cognito::UserPoolGroup',
        Properties: {
          GroupName: 'motorist',
          UserPoolId: {
            Ref: 'CognitoUserPool'
          }
        }
      },
      UserGroupAdmin: {
        Type: 'AWS::Cognito::UserPoolGroup',
        Properties: {
          GroupName: 'admin',
          UserPoolId: {
            Ref: 'CognitoUserPool'
          }
        }
      },

      CognitoUserPoolClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
          ClientName: 'Driven_UserPoolClient',
          ExplicitAuthFlows: [
            "ADMIN_NO_SRP_AUTH"
          ],
          UserPoolId: {
            Ref: 'CognitoUserPool'
          },
          WriteAttributes: [
            'email',
            'phone_number',
            'given_name',
            'family_name'
          ]
        }
      }
    },
    Outputs: {
      UserPoolId: {
        Value: {
          Ref: 'CognitoUserPool'
        }
      },

      UserPoolArn: {
        Value: {
          'Fn::GetAtt': ['CognitoUserPool', 'Arn']
        }
      },
      UserPoolClientId: {
        Value: {
          Ref: 'CognitoUserPoolClient'
        }
      },
      UsersTableArn: {
        Value: {
          Ref: 'UsersTable'
        }
      }
    }

  }
}

module.exports = serverlessConfiguration

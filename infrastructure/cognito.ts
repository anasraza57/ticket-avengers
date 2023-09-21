import { StackContext } from 'sst/constructs'
import { Cognito } from 'sst/constructs'
import { aws_cognito } from 'aws-cdk-lib'

export function AuthCognito({ stack }: StackContext) {

    // SST will automatically create a User Pool Client for this User Pool
    const cognito = new Cognito(stack, 'AuthCognito', {
        login: ['email', 'phone', 'username'],
        cdk: {
            userPool: {
                accountRecovery: aws_cognito.AccountRecovery.EMAIL_ONLY,
                autoVerify: { email: true, phone: true },
                passwordPolicy: {
                    minLength: 8,
                    requireLowercase: true,
                    requireDigits: true,
                    requireSymbols: true,
                    requireUppercase: false
                },
                standardAttributes: {
                    email: {
                        mutable: true,
                        required: true
                    },
                    phoneNumber: {
                        mutable: true,
                        required: true
                    }
                },
              selfSignUpEnabled: false
            }
        }
    })

    new aws_cognito.CfnUserPoolGroup(stack, 'UserGroupAdmin', {
        userPoolId: cognito.cdk.userPool.userPoolId,
        groupName: 'admin',
        precedence: 0
    })

    new aws_cognito.CfnUserPoolGroup(stack, 'UserGroupMotorist', {
        userPoolId: cognito.cdk.userPool.userPoolId,
        groupName: 'motorist',
        precedence: 1
    })

    return {
        cognito
    }
}


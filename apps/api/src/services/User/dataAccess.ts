import { DynamoDB, TransactionCanceledException } from '@driven-app/aws-clients/DynamoDB'
import { 
    CognitoClient, 
    AdminCreateUserCommand, 
    AdminSetUserPasswordCommand, 
    AdminAddUserToGroupCommand,
    AdminDeleteUserCommand,
    AdminDisableUserCommand,
    InvalidPasswordException,
    UsernameExistsException
 } from '@driven-app/aws-clients/Cognito'
import { camelCase } from 'lodash-es'
import { v4 as uuid } from 'uuid'
import { environment } from '../../configuration/environment'
import errorCodes from '../../configuration/errorCodes'

const DYNAMODB_TABLE_NAME_BASE = 'Users'
const DYNAMODB_TABLE_NAME = environment.dynamodb.tableNamePrefix ? `${environment.dynamodb.tableNamePrefix}-${DYNAMODB_TABLE_NAME_BASE}`  : DYNAMODB_TABLE_NAME_BASE
const ID_PREFIX = camelCase(DYNAMODB_TABLE_NAME_BASE)

type CreateInput = {
    email: string
    phone: string
    groups?: string[]
    password: string
    firstName: string
    lastName: string
}

type UserRecord = CreateInput & {
    id: string
    isActive: boolean
    groups: string[]
    createdOn: string
    updatedOn: string
}

type UpdateInput = {
    id: string
    attributes: Partial<CreateInput> & {
        isActive?: boolean
    }
}

/**
 * Creates a new user record in the database and Cognito user pool.
 * @param input - The input data for creating a user.
 * @returns The newly created user record.
 * @throws Throws an error if there is a duplicate email or phone number.
 */
export async function create(input: CreateInput) {
    const defaultValues = {
        isActive: true,
        groups: []
    }

    const uniqueId = uuid()
    const newUserRecord = {
        ...defaultValues,
        ...input,
        password: undefined, // setting this to undefined will prevent it from being persisted to the database
        id: `${ID_PREFIX}:${uniqueId}`
    }

    const newRecords = [
        newUserRecord,
        {
            id: `phone#${input.phone}`,
            userId: newUserRecord.id
        },
        {
            id: `email#${input.email}`,
            userId: newUserRecord.id
        }
    ]

    const transactionPayload = newRecords.map(record => ({
        tableName: DYNAMODB_TABLE_NAME,
        item: record
    }))
    
    try {
        await DynamoDB.putItemTransaction(transactionPayload)

        const cognitoCreateUserPayload = new AdminCreateUserCommand({
            UserPoolId: environment.cognito.userPoolId,
            Username: newUserRecord.id,
            // DesiredDeliveryMediums: ['EMAIL'],
            MessageAction: 'SUPPRESS',
            UserAttributes: [
                {
                    Name: 'given_name',
                    Value: newUserRecord.firstName
                },
                {
                    Name: 'family_name',
                    Value: newUserRecord.lastName
                },
                {
                    Name: 'email',
                    Value: newUserRecord.email
                },
                {
                    Name: 'email_verified',
                    Value: 'True'
                },
                {
                    Name: 'phone_number',
                    Value: newUserRecord.phone
                },
                {
                    Name: 'phone_number_verified',
                    Value: 'True'
                }
            ]
        })

        const congnitoSetPasswordPayload = new AdminSetUserPasswordCommand({
            Password: input.password,
            UserPoolId: environment.cognito.userPoolId,
            Username: newUserRecord.id,
            Permanent: true
        })

        // this has to be done in series because the Cognito account has to be created before we can set the password
        await CognitoClient.send(cognitoCreateUserPayload)
        await CognitoClient.send(congnitoSetPasswordPayload)

        if (newUserRecord.groups.length > 0){
            const cognitoAddUserToGroupPayloads = newUserRecord.groups.map(group => new AdminAddUserToGroupCommand({
                GroupName: group,
                UserPoolId: environment.cognito.userPoolId,
                Username: newUserRecord.id
            }))

            await Promise.all(cognitoAddUserToGroupPayloads.map(payload => CognitoClient.send(payload)))
        }


        return newUserRecord
    } catch (err) {
        
        console.error(`Failed to create user`)
        console.error(err)

        if (err instanceof InvalidPasswordException) {
            // clean up DynamoDB records if Cognito fails
            await remove(newUserRecord.id)

            throw errorCodes.USER.INVALID_PASSWORD
        } else if (err instanceof UsernameExistsException || err instanceof TransactionCanceledException) {
            throw errorCodes.USER.PHONE_OR_EMAIL_ALREADY_EXISTS
        } else {
            throw err
        }
        
    }
}

export async function update(input: UpdateInput) {

    const userId = input.id
    const updatedAttributes = input.attributes
    updatedAttributes.password = undefined // setting this to undefined will prevent it from being persisted to the database

    const isUpdatingPassword = !!updatedAttributes.password

    // TODO: deal with updating email and phone number in a transaction
    // TODO: deal with updating attributes in cognito
    const response = await DynamoDB.updateItem<UserRecord>({
        tableName: DYNAMODB_TABLE_NAME,
        key: { id: userId },
        attributes: updatedAttributes
    })

    if (isUpdatingPassword) {
        const cognitoSetPasswordPayload = new AdminSetUserPasswordCommand({
            Password: updatedAttributes.password,
            UserPoolId: environment.cognito.userPoolId,
            Username: userId,
            Permanent: true
        })

        await CognitoClient.send(cognitoSetPasswordPayload)
    }

    return response
}

/**
 * Find a specific user by their ID (which is the same as their "username" in Cognito)
 * 
 * @param id 
 * @returns 
 */
export async function findById(id: string) {
    const response = await DynamoDB.getItem<UserRecord>({
        tableName: DYNAMODB_TABLE_NAME,
        key: { id }
    })

    return response
}

/**
 * Find a specific user by their email address
 * 
 * @param email 
 * @returns 
 */
export async function findByEmail(email: string) {
    let user

    const emailMatch = await DynamoDB.getItem<{id: string, userId: string}>({
        tableName: DYNAMODB_TABLE_NAME,
        key: { id: `email#${email}` }
    })

    if (emailMatch) {
        user = await DynamoDB.getItem<UserRecord>({
            tableName: DYNAMODB_TABLE_NAME,
            key: { id: emailMatch.userId }
        })
    }

    return user
}


/**
 * Find a specific user by their phonenumber
 * 
 * @param email 
 * @returns 
 */
export async function findByPhone(phoneNumber: string) {
    let user

    const emailMatch = await DynamoDB.getItem<{id: string, userId: string}>({
        tableName: DYNAMODB_TABLE_NAME,
        key: { id: `phone#${phoneNumber}` }
    })

    if (emailMatch) {
        user = await DynamoDB.getItem<UserRecord>({
            tableName: DYNAMODB_TABLE_NAME,
            key: { id: emailMatch.userId }
        })
    }

    return user
}

export async function remove(id: string) {
    const user = await findById(id)

    await DynamoDB.remove({
        tableName: DYNAMODB_TABLE_NAME,
        key: { id }
    })

    await DynamoDB.remove({
        tableName: DYNAMODB_TABLE_NAME,
        key: { id: `phone#${user?.phone}` }
    })
    await DynamoDB.remove({
        tableName: DYNAMODB_TABLE_NAME,
        key: { id: `email#${user?.email}` }
    })

    const disableUser = new AdminDisableUserCommand({
        UserPoolId: environment.cognito.userPoolId,
        Username: id
    })
    const deleteUser = new AdminDeleteUserCommand({
        UserPoolId: environment.cognito.userPoolId,
        Username: id
    })

    try {
        await CognitoClient.send(disableUser)
        await CognitoClient.send(deleteUser)
    } catch(err) {
        console.warn('failed to remove the user from Cognito: ', err)
        // do nothing, just swallow the error
    }
}
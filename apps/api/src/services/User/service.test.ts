import { generateAuthTokens, createUser, refreshAuthToken } from './service'
import ErrorCodes from '../../configuration/errorCodes'
import * as DAL from './dataAccess'
import { createTokenVerifier, CognitoClient } from '@driven-app/aws-clients/Cognito'

// Mock the DAL functions
jest.mock('./dataAccess', () => ({
    findByEmail: jest.fn().mockResolvedValue({ id: 'user123', isActive: true }),
    findByPhone: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation((user) => Promise.resolve({ ...user, id: 'abc-123', isActive: true, groups: [], createdOn: '2023-01-01', updatedOn: '2023-01-01' })),
}))

    // Mock the CognitoClient
jest.mock('@driven-app/aws-clients/Cognito', () => ({
    CognitoClient: {
        send: jest.fn().mockResolvedValue({
        AuthenticationResult: {
            ExpiresIn: 3600,
            AccessToken: 'accessToken123',
            RefreshToken: 'refreshToken123',
            IdToken: 'idToken123'
        }
        })
    },
    AdminInitiateAuthCommand: jest.fn(),
    createTokenVerifier: jest.fn().mockReturnValue({
        verify: jest.fn().mockResolvedValue({
            sub: 'user123',
            exp: 3600
        })
    })
}))

const mockedCreateTokenVerifier = jest.mocked(createTokenVerifier)
const mockedCognitoClient = jest.mocked(CognitoClient)

describe('generateAuthTokens', () => {
  it('should generate authentication tokens for a user with valid credentials', async () => {

    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    }

    const result = await generateAuthTokens(credentials)

    expect(result).toEqual({
      userId: 'user123',
      expiresIn: 3600,
      accessToken: 'accessToken123',
      refreshToken: 'refreshToken123',
      idToken: 'idToken123'
    })
  })

  it('should throw an error if the user is not found', async () => {
    // @ts-ignore: this is a mock
    DAL.findByEmail.mockResolvedValueOnce(undefined)
    try {
        await generateAuthTokens({ email: 'test@test.com', password: '' })
    } catch (error) {
        expect(error).toEqual(ErrorCodes.USER.NOT_FOUND)
    }

    // @ts-ignore: this is a mock
    DAL.findByPhone.mockResolvedValueOnce(undefined)
    try {
        await generateAuthTokens({ phone: '+15555555555', password: '' })
    } catch (error) {
        expect(error).toEqual(ErrorCodes.USER.NOT_FOUND)
    }
  })
  it('should throw an error if the user is not active', async () => {
    // @ts-ignore: this is a mock
    DAL.findByPhone.mockResolvedValueOnce({ id: 'user123', isActive: false })
    try {
        await generateAuthTokens({ phone: '+15555555555', password: '' })
    } catch (error) {
        expect(error).toEqual(ErrorCodes.USER.NOT_ACTIVE)
    }
  })

  it('should throw an error if no phone and no email is provided', async () => {
    try {
        await generateAuthTokens({ password: '' })
    } catch (error) {
        expect(error).toEqual(ErrorCodes.USER.MISSING_EMAIL_OR_PHONE)
    }
  })
})

describe('refreshAuthToken', () => {
    it('should return a set of new tokens if the access token is expired', async () => {
        // @ts-ignore: this is a mock
        mockedCreateTokenVerifier.mockReturnValueOnce({
            verify: jest.fn().mockResolvedValue({
                username: 'user123',
                exp: 2
            })
        })

        const tokens = {
            ExpiresIn: 3600,
            AccessToken: 'accessToken123',
            RefreshToken: 'refreshToken123',
            IdToken: 'idToken123'
        }

        mockedCognitoClient.send.mockImplementationOnce(() => {
            return {
                AuthenticationResult: tokens
            }
        })

        const result = await refreshAuthToken({
            tokens: {
                accessToken: 'someFakeAccessToken',
                refreshToken: 'someFakeRefreshToken',
                idToken: 'someFakeIdToken'
            }
        })

        const expected = {
            expiresIn: 3600,
            accessToken: 'accessToken123',
            refreshToken: 'refreshToken123',
            idToken: 'idToken123',
            userId: 'user123'
        }

        expect(result).toEqual(expected)
    })

    it('should return the same tokens if the access token is NOT expired', async () => {
        const now = Date.now()

        // @ts-ignore: this is a mock
        mockedCreateTokenVerifier.mockReturnValueOnce({
            verify: jest.fn().mockResolvedValue({
                username: 'user123',
                exp: (now / 1000) + 500
            })
        })

        const result = await refreshAuthToken({
            tokens: {
                accessToken: 'someFakeAccessToken',
                refreshToken: 'someFakeRefreshToken',
                idToken: 'someFakeIdToken'
            }
        })

        const expected = {
            accessToken: 'someFakeAccessToken',
            refreshToken: 'someFakeRefreshToken',
            idToken: 'someFakeIdToken',
            userId: 'user123',
            expiresIn: expect.any(Number)
        }

        expect(result).toEqual(expected)
    })
})

describe('createUser', () => {
    const sampleUserAttributes = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        phone: '+18339234321',
        password: 'password123'
    }

  it('should throw an error if an invalid email is given', async () => {
    const badEmail = {
        ...sampleUserAttributes,
        email: 'bademail'
    }

    try {
        await createUser(badEmail)
    } catch (error) {
        expect(error).toEqual(ErrorCodes.USER.INVALID_EMAIL)
    }
  })

  it('should throw an error if an invalid phone number is given', async () => {
    const badPhone = {
        ...sampleUserAttributes,
        phone: 'badphone'
    }

    try {
        await createUser(badPhone)
    } catch (error) {
        expect(error).toEqual(ErrorCodes.USER.INVALID_PHONE)
    }
  })

    it('should create a user with valid attributes', async () => {
        const result = await createUser(sampleUserAttributes)

        expect(result).toBeInstanceOf(Object)
    })

})
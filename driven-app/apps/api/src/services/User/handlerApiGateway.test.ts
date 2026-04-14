import { APIGatewayProxyEventV2, APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda'
import { RestApi } from '@driven-app/shared-types/api'
import * as Service from './service'
import { login, create, logout, refresh } from './handlerApiGateway'


jest.mock('./service', () => ({
    generateAuthTokens: jest.fn().mockResolvedValue({
        userId: 'abc-123',
        expiresIn: 3600,
        accessToken: '-- some fake token --',
        refreshToken: '-- some fake token --',
        idToken: '-- some fake token --'
    }),
    createUser: jest.fn(),
    refreshAuthToken: jest.fn().mockResolvedValue({
      userId: 'abc-123',
      expiresIn: 3600,
      accessToken: '-- some fake token --',
      refreshToken: '-- some fake token --',
      idToken: '-- some fake token --'
    })
  }))

describe('login', () => {
    it('should return a successful response with access and refresh tokens', async () => {
        const event = {
            body: JSON.stringify({
                username: 'testuser',
                password: 'testpassword'
            }),
            isBase64Encoded: false
        } as APIGatewayProxyEventV2;

        const response: { statusCode: number; body: string; cookies?: string[]; } = await login(event);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();

        const responseBody = JSON.parse(response.body);
        expect(responseBody.userId).toBeDefined();
        expect(responseBody.expiresIn).toBeDefined();

        expect(response.cookies).toBeDefined();
        expect(response.cookies!.length).toBe(3);
    });

    it('should return a successful response when the body is base64 encoded', async () => {
      const event = {
          body: Buffer.from(JSON.stringify({
            username: 'testuser',
            password: 'testpassword'
        })).toString('base64'),
          isBase64Encoded: true
      } as APIGatewayProxyEventV2;

      const response: { statusCode: number; body: string; cookies?: string[]; } = await login(event);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();

      const responseBody = JSON.parse(response.body);
      expect(responseBody.userId).toBeDefined();
      expect(responseBody.expiresIn).toBeDefined();

      expect(response.cookies).toBeDefined();
      expect(response.cookies!.length).toBe(3);
  });

    it('should throw an error if the event body is empty', async () => {
        const event = {
            body: '',
            isBase64Encoded: false
        } as APIGatewayProxyEventV2;

        const expectedResponse = {
            statusCode: 400,
            body: JSON.stringify({
              message: 'Missing body'
            })
          }
      
          const response = await login(event)
      
          expect(response).toEqual(expectedResponse)
    });
})

describe('refresh', () => {
  it('should return a successful response with access and refresh tokens', async () => {
      const event = {
          body: undefined,
          isBase64Encoded: false,
          requestContext: {
            authorizer: {
              lambda: {
                userId: 'abc-123',
                email: 'test@test',
                groups: 'admin,user'
              }
            }
          },
          cookies: [
            'accessToken=fakeAccessToken',
            'refreshToken=fakeRefreshToken'
          ]
      } as APIGatewayProxyEventV2WithLambdaAuthorizer<RestApi.AuthorizationContext>;

      const response: { statusCode: number; body: string; cookies?: string[]; } = await refresh(event);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();

      const responseBody = JSON.parse(response.body);
      expect(responseBody.userId).toBeDefined();
      expect(responseBody.expiresIn).toBeDefined();

      expect(response.cookies).toBeDefined();
      expect(response.cookies!.length).toBe(3);
  })
})

describe('create', () => {
    it('should return the created user', async () => {
      const event = {
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpassword'
        }),
        isBase64Encoded: false
      } as APIGatewayProxyEventV2
  
      const expectedUser = {
        id: '123456',
        password: undefined,
        firstName: 'Test_firstName',
        lastName: 'Test_lastName',
        email: 'test@test.com',
        phone: '+18334234321',
        groups: ['group1', 'group2'],
        isActive: true,
        createdOn: '2021-01-01T00:00:00.000Z',
        updatedOn: '2021-01-01T00:00:00.000Z'
      }
  
      jest.spyOn(Service, 'createUser').mockResolvedValueOnce(expectedUser)
  
      const response = await create(event)
  
      expect(response).toEqual(expectedUser)
    })

    it('should return the created user when the body is base64 encoded', async () => {
      const event = {
        body: Buffer.from(JSON.stringify({
          username: 'testuser',
          password: 'testpassword'
        })).toString('base64'),
        isBase64Encoded: true
      } as APIGatewayProxyEventV2
  
      const expectedUser = {
        id: '123456',
        password: undefined,
        firstName: 'Test_firstName',
        lastName: 'Test_lastName',
        email: 'test@test.com',
        phone: '+18334234321',
        groups: ['group1', 'group2'],
        isActive: true,
        createdOn: '2021-01-01T00:00:00.000Z',
        updatedOn: '2021-01-01T00:00:00.000Z'
      }
  
      jest.spyOn(Service, 'createUser').mockResolvedValueOnce(expectedUser)
  
      const response = await create(event)
  
      expect(response).toEqual(expectedUser)
    })
  
    it('should return an error response if the event body is null', async () => {
      const event = {
        body: '',
        isBase64Encoded: false
      } as APIGatewayProxyEventV2
  
      const expectedResponse = {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing body'
        })
      }
  
      const response = await create(event)
  
      expect(response).toEqual(expectedResponse)
    })
  })
  
  describe('logout', () => {
    it('should return a successful response with deleted access token and refresh token', async () => {
      const expectedResponse = {
        isBase64Encoded: false,
        statusCode: 204,
        cookies: [
          'accessToken=undefined; Secure; HttpOnly; SameSite=Lax; Path=/api; Max-Age: -1',
          'idToken=undefined; Secure; HttpOnly; SameSite=Lax; Path=/api; Max-Age: -1',
          'refreshToken=undefined; Secure; HttpOnly; SameSite=Lax; Path=/api'
        ]
      }
  
      const response = await logout()
  
      expect(response).toEqual(expectedResponse)
    })
  })
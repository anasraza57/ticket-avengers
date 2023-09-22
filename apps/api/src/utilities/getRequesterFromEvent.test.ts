import { APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda'
import { RestApi } from '@driven-app/shared-types/api'
import getRequesterFromEvent from './getRequesterFromEvent'

describe('getRequesterFromEvent', () => {
  it('should extract the requester information from an API Gateway event with Lambda authorizer', () => {
    const apiGatewayEvent: APIGatewayProxyEventV2WithLambdaAuthorizer<RestApi.AuthorizationContext> = {
    // @ts-ignore: this is a mock event
      requestContext: {
        authorizer: {
          lambda: {
            userId: '123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@test.com',
            phone: '+1234567890',
            groups: 'admin,user',
          },
        },
      },
    }

    const expectedRequester: RestApi.Requester = {
        userId: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        phone: '+1234567890',
        groups: ['admin', 'user'],
    }

    const actualRequester = getRequesterFromEvent(apiGatewayEvent)

    expect(actualRequester).toEqual(expectedRequester)
  })

  it('shouldreturn an empty group if no groups are specified', () => {
    const apiGatewayEvent: APIGatewayProxyEventV2WithLambdaAuthorizer<RestApi.AuthorizationContext> = {
    // @ts-ignore: this is a mock event
      requestContext: {
        authorizer: {
          lambda: {
            userId: '123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@test.com',
            phone: '+1234567890',
            groups: '',
          },
        },
      },
    }

    const expectedRequester: RestApi.Requester = {
        userId: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        phone: '+1234567890',
        groups: [],
    }

    const actualRequester = getRequesterFromEvent(apiGatewayEvent)

    expect(actualRequester).toEqual(expectedRequester)
  })
})
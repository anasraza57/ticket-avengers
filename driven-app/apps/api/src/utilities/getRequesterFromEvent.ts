import {  APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda'
import { RestApi } from '@driven-app/shared-types/api'
import { compact } from 'lodash-es'

/**
 * Extracts the requester information from an API Gateway event with Lambda authorizer.
 * 
 * @param apiGatewayEvent - The API Gateway event with Lambda authorizer.
 * @returns The requester information.
 */
export default function (apiGatewayEvent: APIGatewayProxyEventV2WithLambdaAuthorizer<RestApi.AuthorizationContext>): RestApi.Requester {
    const requester = apiGatewayEvent.requestContext.authorizer.lambda

    return {
        ...requester,
        groups: compact(requester?.groups.split(',')) || []
    }
}
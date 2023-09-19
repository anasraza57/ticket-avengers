import type { ErrorCode } from '../environments/errorCodes'

/**
 * Handles thrown errors and returns an appropriate response or rethrows the error.
 * 
 * @param thrownElement - The element that was thrown.
 * @returns The response object if the thrown element is an instance of ErrorCode, otherwise throws an error. This will match what API Gateway expects: https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html#apigateway-types-transforms.
 * @throws Error - If the thrown element is an instance of Error or a string.
 */
export default function(thrownElement: unknown) {

    if (process.env['NODE_ENV'] !== 'test') {
        // don't console-log in tests because it will clutter the test output
        console.warn('something throw an exception', thrownElement)
    }

    if (thrownElement instanceof Error && 'message' in thrownElement) {
        const unexpectedError = thrownElement as Error
        throw new Error(unexpectedError.message)

    }  else if (typeof thrownElement === 'string') {
        throw new Error(thrownElement)
    } else if (thrownElement instanceof Object && 'code' in thrownElement) {
        const internalError = thrownElement as ErrorCode
        return {
            statusCode: internalError.httpStatus,
            body: JSON.stringify({
                code: internalError.code,
                message: internalError.message
            })
        }
    } else {
        throw new Error('Unexpected error')
    }
}
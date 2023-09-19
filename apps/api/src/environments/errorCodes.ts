const ErrorCodes = {
    USER: {
        NOT_FOUND: {
            code: 'U01',
            message: 'User not found.',
            httpStatus: 404
        },
        MISSING_EMAIL_OR_PHONE: {
            code: 'U02',
            message: 'Missing email or phone.',
            httpStatus: 400
        },
        INVALID_PHONE: {
            code: 'U03',
            message: 'The phone number provided is not a valid US number.',
            httpStatus: 400
        },
        INVALID_EMAIL: {
            code: 'U04',
            message: 'The email address provided is not valid.',
            httpStatus: 400
        },
        NOT_ACTIVE: {
            code: 'U05',
            message: 'User is not active.',
            httpStatus: 400
        },
        PHONE_OR_EMAIL_ALREADY_EXISTS: {
            code: 'U06',
            message: 'The phone number or email provided is already in use.',
            httpStatus: 400
        },
        INVALID_PASSWORD: {
            code: 'U07',
            message: 'The password provided does not conform to policy. It must be at least 8 characters with at least 1 number and at least 1 uppercase letter.',
            httpStatus: 400
        }
    }
}

export default ErrorCodes
export type ErrorCode = {
    code: string
    message: string
    httpStatus: number
}
type FormatAuthCookiesOptions = {
    idToken?: string
    accessToken?: string
    refreshToken?: string
    expiresIn: number
    path? : string
}

/**
 * Formats authentication cookies for the API.
 * 
 * @param options - The options for formatting the cookies.
 * @param options.accessToken - The access token to include in the cookie.
 * @param options.idToken - The ID token to include in the cookie.
 * @param options.refreshToken - The refresh token to include in the cookie.
 * @param options.path - The path for the cookie. Defaults to '/api'.
 * @param options.expiresIn - The expiration time for the cookie, in seconds. Pass a negative number to expire the cookie immediately.
 * @returns An array of formatted cookie strings.
 */
export default function(options: FormatAuthCookiesOptions) {
    const path = options.path || '/api'

    return [
        `accessToken=${options.accessToken}; Secure; HttpOnly; SameSite=Lax; Path=${path}; Max-Age: ${options.expiresIn}`,
        `idToken=${options.idToken}; Secure; HttpOnly; SameSite=Lax; Path=${path}; Max-Age: ${options.expiresIn}`,
        `refreshToken=${options.refreshToken}; Secure; HttpOnly; SameSite=Lax; Path=${path}`
    ]
}
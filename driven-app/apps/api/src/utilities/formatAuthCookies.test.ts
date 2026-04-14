import formatAuthCookies from './formatAuthCookies';

describe('formatAuthCookies', () => {
  it('should format authentication cookies with default path', () => {
    const options = {
      idToken: 'idToken',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      expiresIn: 3600,
    };
    const expected = [
      'accessToken=accessToken; Secure; HttpOnly; SameSite=Lax; Path=/api; Max-Age: 3600',
      'idToken=idToken; Secure; HttpOnly; SameSite=Lax; Path=/api; Max-Age: 3600',
      'refreshToken=refreshToken; Secure; HttpOnly; SameSite=Lax; Path=/api',
    ];
    const actual = formatAuthCookies(options);
    expect(actual).toEqual(expected);
  });

  it('should format authentication cookies with custom path', () => {
    const options = {
      idToken: 'idToken',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      expiresIn: 3600,
      path: '/custom',
    };
    const expected = [
      'accessToken=accessToken; Secure; HttpOnly; SameSite=Lax; Path=/custom; Max-Age: 3600',
      'idToken=idToken; Secure; HttpOnly; SameSite=Lax; Path=/custom; Max-Age: 3600',
      'refreshToken=refreshToken; Secure; HttpOnly; SameSite=Lax; Path=/custom',
    ];
    const actual = formatAuthCookies(options);
    expect(actual).toEqual(expected);
  });

  it('should format authentication cookies with negative expiration time', () => {
    const options = {
      idToken: 'idToken',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      expiresIn: -1,
    };
    const expected = [
      'accessToken=accessToken; Secure; HttpOnly; SameSite=Lax; Path=/api; Max-Age: -1',
      'idToken=idToken; Secure; HttpOnly; SameSite=Lax; Path=/api; Max-Age: -1',
      'refreshToken=refreshToken; Secure; HttpOnly; SameSite=Lax; Path=/api',
    ];
    const actual = formatAuthCookies(options);
    expect(actual).toEqual(expected);
  });
});
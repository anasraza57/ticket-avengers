import httpErrorHandler from './httpErrorHandler';

describe('httpErrorHandler', () => {
  it('should throw an error if the thrown element is an instance of Error', () => {
    const thrownElement = new Error('Some error');
    expect(() => httpErrorHandler(thrownElement)).toThrowError('Some error');
  });

  it('should throw an error if the thrown element is a string', () => {
    const thrownElement = 'Some error message';
    expect(() => httpErrorHandler(thrownElement)).toThrowError('Some error message');
  });

  it('should return a response object if the thrown element is an instance of ErrorCode', () => {
    const thrownElement = {
      code: 'SOME_ERROR',
      message: 'Some error message',
      httpStatus: 500,
    };
    const expectedResponse = {
      statusCode: 500,
      body: JSON.stringify({
        code: 'SOME_ERROR',
        message: 'Some error message',
      }),
    };
    expect(httpErrorHandler(thrownElement)).toEqual(expectedResponse);
  });

  it('should throw an error if the thrown element does not match any of the expected types', () => {
    const thrownElement = 123;
    expect(() => httpErrorHandler(thrownElement)).toThrowError('Unexpected error');
  });
});
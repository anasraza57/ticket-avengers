import { mockClient  } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { DynamoDB } from './DynamoDB'

// info on how to mock DynamoDB with SDK v3: https://aws.amazon.com/blogs/developer/mocking-modular-aws-sdk-for-javascript-v3-in-unit-tests/
const ddbMock = mockClient(DynamoDBDocumentClient)


describe('DynamoDB', () => {
    afterEach(() => {
        ddbMock.reset();
      });
    describe('putItem', () => {

        beforeEach(() => {
            ddbMock.on(PutCommand).callsFake((input) => ({ Attributes: input.Item }))
        })

    it('should create a new item and return the attributes, with `updatedOn` and `createdOn` added', async () => {
    
      const tableName = 'myTable'
      const item = { id: '1', name: 'John Doe' }
      const expected = {...item, createdOn: new Date().toISOString(), updatedOn: new Date().toISOString()}

      const result = await DynamoDB.putItem({ tableName, item })

      expect(result).toEqual(expected)
    });
  });

  describe('updateItem', () => {
    beforeEach(() => {
      ddbMock.on(UpdateCommand).callsFake((input) => {
        const id = input.Key.id
        const keys = Object.keys(input.ExpressionAttributeNames).map(key => key.replace('#', ''))
        const values = Object.values(input.ExpressionAttributeValues)
        const attributes = keys.reduce((acc, key, index) => {
          acc[key] = values[index]
          return acc
        }, {})
        return { Attributes: { id, ...attributes }}
      })
    })

    it('should update an item and return the updated attributes', async () => {
      const tableName = 'myTable'
      const key = { id: '1' }
      const attributes = { name: 'John Smith' }
      const expected = {...attributes, ...key, updatedOn: new Date().toISOString()}
      

      const result = await DynamoDB.updateItem({ tableName, key, attributes });

      expect(result).toEqual(expected);
    });
  });

});
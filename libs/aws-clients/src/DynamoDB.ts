import { DynamoDBClient, AttributeValue } from '@aws-sdk/client-dynamodb'
import { 
  DynamoDBDocumentClient, 
  GetCommand,
  PutCommand, 
  UpdateCommand, 
  QueryCommand,
  DeleteCommand,
  TransactWriteCommand
} from '@aws-sdk/lib-dynamodb'

const MARSHALLING_OPTIONS = { removeUndefinedValues: true, convertEmptyValues: true }
const client = new DynamoDBClient({ region: 'us-east-1', maxAttempts: 2 })
const documentClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: MARSHALLING_OPTIONS
})

type PutItemInput = {
    tableName: string
    item: {[key: string]: unknown} 
  }

type UpdateItemInput = {
    tableName: string
    key: { [key: string]: string }
    attributes: {[key: string]: unknown}
}

type GetItemInput = {
    key: { [key: string]: string }
    tableName: string
  }

type RemoveInput = {
    tableName: string
    key: { [key: string]: string }
}

type FindInput = {
  tableName: string
  indexName: string
  keyValue: unknown
  limit?: number
  filters?: object
  rawOptions?: object
  comparator: DynamoDBQueryComparator
}

type FindOutput<Type> = {
  items: Type[]
  lastEvaluatedKey: string | null
  hasMore: boolean
}

export enum DynamoDBQueryComparator {
  'GREATHER_THAN' = '>',
  'LESS_THAN' = '<',
  'EQUALS' = '=',
  'LESS_THAN_OR_EQUALS' = '<=',
  'GREATHER_THAN_OR_EQUALS' = '>=',
  'NOT_EQUALS' = '<>'
}

export const DynamoDB = {
  /**
   * Creates a new item, or fully replaces an existing one.
   *
   * @param {PutItemOpts} params
   * @returns {Promise<Type>}
   */
  async putItem<Type>(params: PutItemInput): Promise<Type> {

    const now = (new Date()).toISOString()
    const attributes = {
      ...params.item,
      createdOn: now,
      updatedOn: now
    }

    const cmd = new PutCommand({
        TableName: params.tableName,
        Item: attributes,
        ReturnValues: 'ALL_OLD'
    })
  
    const response = await documentClient.send(cmd)
  
    return response.Attributes as Type
  },

  /**
   * Updates an item
   * 
   * @param {UpdateItemInput} params
   * @returns Promise<Type>
   */
  async updateItem<Type>(params: UpdateItemInput):Promise<Type | undefined> {

    const updatedAttributes = {
        ...params.attributes,
        updatedOn: (new Date()).toISOString()
    }

    const cmd = new UpdateCommand({
      TableName: params.tableName,
      Key: params.key,
      ...convertJsonToUpdateOperation(updatedAttributes),
    })
    
    const response = await documentClient.send(cmd)

    return response?.Attributes as Type
  },

  /**
   * Queries for a single item based on its primary key
   * 
   * @param params 
   * @returns 
   */
  async getItem<Type>(params: GetItemInput): Promise<Type | undefined> {
    const cmd = new GetCommand({
        TableName: params.tableName,
        Key: params.key
    })

    const response = await documentClient.send(cmd)

    return response.Item as Type
  },

  /**
   * Queries for items based on then provided index. This will search the Global Secondary Index (GSI)
   * 
   * @param params 
   * @returns 
   */
  async find<Type>(params: FindInput): Promise<FindOutput<Type>> {
    const fieldKey = Object.keys(params.keyValue)[0]
    const fieldValue = Object.values(params.keyValue)[0]

    const cmd = new QueryCommand({
        TableName: params.tableName,
        IndexName: params.indexName,
        Limit: params.limit || 100,
        KeyConditionExpression: `#fieldName ${params.comparator} :fieldValue`,
        ExpressionAttributeNames: {
            '#fieldName': fieldKey
          },
          ExpressionAttributeValues: {
            ':fieldValue': fieldValue
          },
        ...params.rawOptions
    })

    const response = await documentClient.send(cmd)
    const payload = {
        items: response.Items as Type[],
        lastEvaluatedKey: response.LastEvaluatedKey?.id,
        hasMore: !!response.LastEvaluatedKey
    }

    return payload
  },

  /**
   * Delete a single item from a table
   * @param params 
   */
  async remove(params: RemoveInput): Promise<void> {
    const cmd = new DeleteCommand({
        TableName: params.tableName,
        Key: params.key
    })

    await documentClient.send(cmd)
  },

  /**
   * Perform multiple put/create operations in a single batch as a transaction
   * 
   * @param operations 
   */
  async putItemTransaction(operations: PutItemInput[]) {
    const defaultAttributes = {
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString()
    }
    const writeCommands = new TransactWriteCommand({
      TransactItems: operations.map((operation) => ({
        Put: {
          TableName: operation.tableName,
          Item: { ...operation.item, ...defaultAttributes },
          ConditionExpression: 'attribute_not_exists(id)'
        }
      }))
    })

    await documentClient.send(writeCommands)
  },

  
  /**
   * Perform multiple update operations in a single batch as a transaction
   * 
   * @param operations 
   */
    async updateItemTransaction(operations: UpdateItemInput[]) {
      const writeCommands = new TransactWriteCommand({
        TransactItems: operations.map((operation) => ({
          Update: {
            TableName: operation.tableName,
            Key: operation.key,
            ...convertJsonToUpdateOperation(operation.attributes),
          }
        }))
      })
  
      await documentClient.send(writeCommands)
    },


}


/**
 * Converts a JSON object to a DynamoDB update operation. Always uses "SET", so there is no way to "remove" an attribute.
 * 
 * @param input 
 * @returns 
 */
function convertJsonToUpdateOperation(input: { [key: string]: unknown } ) {
    const updateExpressionArray: string[] = []
    const ExpressionAttributeNames: { [key: string]: string } = {}
    const ExpressionAttributeValues: { [key: string]: AttributeValue } = {}
  
    const attributes = input
  
    Object.entries(attributes).forEach(([key, value]: [string, AttributeValue]) => {
      const attributeNameKey = `#${key}`
      const attributeValueKey = `:${key}`
  
      ExpressionAttributeNames[attributeNameKey] = key
      ExpressionAttributeValues[attributeValueKey] = value
  
      updateExpressionArray.push(`${attributeNameKey} = ${attributeValueKey}`)
    })
  
    const UpdateExpression = `SET ${updateExpressionArray.join(', ')}`
  
    return {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    }
  }
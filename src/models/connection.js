import get from 'lodash/get';
import { query, putItem, deleteItem, marshall, unmarshall } from 'vendor_api/aws/dynamodb';
import config from 'utils/config';

export default class Connection {
  /**
   * Creates a connection record
   * @param {string} roomId
   * @param {string} connectionId
   * @returns {undefined}
   */
  static async create(roomId, connectionId) {
    const connection = {
      room_id: roomId,
      connection_id: connectionId
    };

    const Item = marshall(connection);

    const params = {
      TableName: config.get('dynamodb.connections_table'),
      Item
    };

    await putItem(params);
  }

  /**
   * Finds by connectionId and deletes
   * deleteItem does not accept just the secondary index
   * But in onDisconnect only the secondary index is available
   *
   * @param {string} connectionId
   * @returns {undefined}
   */
  static async deleteByConnectionId(connectionId) {
    const TableName = config.get('dynamodb.connections_table');

    const params = {
      ExpressionAttributeValues: {
        ':connection_id': {
          S: connectionId
        }
      },
      KeyConditionExpression: 'connection_id = :connection_id',
      IndexName: 'connection_id',
      TableName
    };

    const data = await query(params);

    const Item = get(data, 'Items[0]');

    if (Item) {
      const connection = unmarshall(Item);
      const { room_id: roomId, connection_id: connectionId } = connection;
      const Key = { room_id: { S: roomId }, connection_id: { S: connectionId } };

      const deleteParams = {
        Key,
        TableName
      };

      await deleteItem(deleteParams);
    }
  }
}

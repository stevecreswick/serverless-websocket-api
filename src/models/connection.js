import _ from 'lodash';
import { query, putItem, deleteItem, marshall, unmarshall } from 'vendor_api/aws/dynamodb';
import config from 'utils/config';

export default class Connection {
  /**
   * Creates a connection record
   * @param {string} streamId
   * @param {string} connectionId
   * @returns {undefined}
   */
  static async create(streamId, connectionId) {
    const connection = {
      stream_id: streamId,
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

    const Item = _.get(data, 'Items[0]');

    if (Item) {
      const connection = unmarshall(Item);
      const { stream_id: streamId, connection_id: connectionId } = connection;
      const Key = { stream_id: { S: streamId }, connection_id: { S: connectionId } };

      const deleteParams = {
        Key,
        TableName
      };

      await deleteItem(deleteParams);
    }
  }
}

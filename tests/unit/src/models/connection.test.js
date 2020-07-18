jest.mock('vendor_api/aws/dynamodb');

import { putItem, query, deleteItem, marshall, unmarshall } from 'vendor_api/aws/dynamodb';
import Connection from 'models/connection';
import { TEST_ROOM_ID, TEST_CONNECTION_ID } from '../../helpers/api-gateway';
import { TEST_SERVICE_NAME, TEST_STAGE } from './../../setup';

describe('Connection', () => {
  const tableName = `${TEST_SERVICE_NAME}-connections-${TEST_STAGE}`;

  let marshalled, unmarshalled;
  beforeEach(() => {
    marshalled = {
      room_id: { S: TEST_ROOM_ID },
      connection_id: { S: TEST_CONNECTION_ID }
    };

    unmarshalled = { room_id: TEST_ROOM_ID, connection_id: TEST_CONNECTION_ID };

    marshall.mockReturnValue(marshalled);
    unmarshall.mockReturnValue(unmarshalled);
  });

  describe('#create', () => {
    it('calls putItem with the correct params', async () => {
      await Connection.create(TEST_ROOM_ID, TEST_CONNECTION_ID);

      expect(putItem).toBeCalledWith({
        Item: marshalled,
        TableName: `${TEST_SERVICE_NAME}-connections-test`
      });
    });
  });

  describe('#deleteByConnectionId', () => {
    it('queries by the connectionId and deletes the item', async () => {
      query.mockReturnValue({ Items: [marshalled] });

      await Connection.deleteByConnectionId(TEST_CONNECTION_ID);

      const params = {
        ExpressionAttributeValues: { ':connection_id': { S: TEST_CONNECTION_ID } },
        IndexName: 'connection_id',
        KeyConditionExpression: 'connection_id = :connection_id',
        TableName: tableName
      };

      const deleteParams = {
        Key: marshalled,
        TableName: tableName
      };

      expect(query).toBeCalledWith(params);
      expect(deleteItem).toBeCalledWith(deleteParams);
    });

    it('does not call delete if the connection id is no longer in the db', async () => {
      query.mockReturnValue({ Items: [] });

      const params = {
        ExpressionAttributeValues: { ':connection_id': { S: TEST_CONNECTION_ID } },
        IndexName: 'connection_id',
        KeyConditionExpression: 'connection_id = :connection_id',
        TableName: tableName
      };

      await Connection.deleteByConnectionId(TEST_CONNECTION_ID);

      expect(query).toBeCalledWith(params);
    });
  });
});

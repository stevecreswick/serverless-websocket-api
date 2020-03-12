jest.mock('vendor_api/aws/dynamodb');

import { putItem, query, deleteItem, marshall, unmarshall } from 'vendor_api/aws/dynamodb';
import Connection from 'models/connection';
import { TEST_STREAM_ID, TEST_CONNECTION_ID } from '../../helpers/api-gateway';

describe('Connection', () => {
  let marshalled, unmarshalled;
  beforeEach(() => {
    marshalled = {
      stream_id: { S: TEST_STREAM_ID },
      connection_id: { S: TEST_CONNECTION_ID }
    };

    unmarshalled = { stream_id: TEST_STREAM_ID, connection_id: TEST_CONNECTION_ID };

    marshall.mockReturnValue(marshalled);
    unmarshall.mockReturnValue(unmarshalled);
  });

  describe('#create', () => {
    it('calls putItem with the correct params', async () => {
      await Connection.create(TEST_STREAM_ID, TEST_CONNECTION_ID);

      expect(putItem).toBeCalledWith({
        Item: marshalled,
        TableName: 'stream-orchestrator-update-websockets-connections-test'
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
        TableName: 'stream-orchestrator-update-websockets-connections-test'
      };

      const deleteParams = {
        Key: marshalled,
        TableName: 'stream-orchestrator-update-websockets-connections-test'
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
        TableName: 'stream-orchestrator-update-websockets-connections-test'
      };

      await Connection.deleteByConnectionId(TEST_CONNECTION_ID);

      expect(query).toBeCalledWith(params);
    });
  });
});

jest.mock('models/connection');

import { handler } from 'lambdas/on-connect';
import { TEST_ROOM_ID, TEST_CONNECTION_ID, getConnectionEvent } from '../../helpers/api-gateway';
import Connection from 'models/connection';

describe('onConnect Lambda', () => {
  let event;
  beforeEach(() => {
    event = getConnectionEvent();
  });

  describe('#handler', () => {
    it('returns a 400 if the room id is missing', async () => {
      delete event.queryStringParameters.room_id;

      const res = await handler(event);

      expect(res).toEqual({ statusCode: 400 });
    });

    it('creates a connection in dynamodb', async () => {
      const res = await handler(event);

      expect(Connection.create).toBeCalledWith(TEST_ROOM_ID, TEST_CONNECTION_ID);
      expect(res).toEqual({ statusCode: 200 });
    });
  });
});

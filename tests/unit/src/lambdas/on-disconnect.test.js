jest.mock('models/connection');

import { handler } from 'lambdas/on-disconnect';
import { TEST_CONNECTION_ID, getDisconnectEvent } from '../../helpers/api-gateway';
import Connection from 'models/connection';

describe('onDisconnect Lambda', () => {
  let event;
  beforeEach(() => {
    event = getDisconnectEvent();
  });

  describe('#handler', () => {
    it('deletes a connection from dynamodb by its connection id', async () => {
      const res = await handler(event);

      expect(Connection.deleteByConnectionId).toBeCalledWith(TEST_CONNECTION_ID);
      expect(res).toEqual({ statusCode: 204 });
    });
  });
});

export const TEST_ROOM_ID = 'room1';
export const TEST_CONNECTION_ID = 'connection1';

export const getConnectionEvent = () => {
  return {
    queryStringParameters: {
      room_id: TEST_ROOM_ID
    },
    requestContext: {
      connectionId: TEST_CONNECTION_ID
    }
  };
};

export const getDisconnectEvent = () => {
  return {
    requestContext: {
      connectionId: TEST_CONNECTION_ID
    }
  };
};

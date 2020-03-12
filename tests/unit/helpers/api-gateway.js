export const TEST_STREAM_ID = 'stream1';
export const TEST_CONNECTION_ID = 'connection1';

export const getConnectionEvent = () => {
  return {
    queryStringParameters: {
      stream_id: TEST_STREAM_ID
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

import _ from 'lodash';
import Connection from 'models/connection';

/**
 * onConnect Handler
 * @param {object} event
 * @returns {object}
 */
const handler = async event => {
  const roomId = _.get(event, 'queryStringParameters.room_id');
  const connectionId = _.get(event, 'requestContext.connectionId');

  if (!roomId) {
    return { statusCode: 400 };
  }

  await Connection.create(roomId, connectionId);

  return { statusCode: 200 };
};

export { handler };

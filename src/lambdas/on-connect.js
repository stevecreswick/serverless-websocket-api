import _ from 'lodash';
import Connection from 'models/connection';

/**
 * onConnect Handler
 * @param {object} event
 * @returns {object}
 */
const handler = async event => {
  const streamId = _.get(event, 'queryStringParameters.stream_id');
  const connectionId = _.get(event, 'requestContext.connectionId');

  if (!streamId) {
    return { statusCode: 400 };
  }

  // @todo: connect to redis to check if stream is in an active state

  await Connection.create(streamId, connectionId);

  return { statusCode: 200 };
};

export { handler };

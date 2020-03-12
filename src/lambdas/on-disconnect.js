import _ from 'lodash';
import Connection from 'models/connection';

/**
 * onDisconnect Handler
 * @param {object} event
 * @returns {object}
 */
const handler = async event => {
  const connectionId = _.get(event, 'requestContext.connectionId');

  await Connection.deleteByConnectionId(connectionId);

  return { statusCode: 204 };
};

export { handler };

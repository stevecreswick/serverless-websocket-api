import util from 'util';
import aws from 'aws-sdk';
import config from 'utils/config';

let ddbConfig = { apiVersion: '2012-10-08' };

if (config.isLocalEnvironment()) {
  ddbConfig = {
    ...ddbConfig,
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  };
}

const dynamodb = new aws.DynamoDB(ddbConfig);

// DB Operations
const query = util.promisify(dynamodb.query).bind(dynamodb);
const putItem = util.promisify(dynamodb.putItem).bind(dynamodb);
const deleteItem = util.promisify(dynamodb.deleteItem).bind(dynamodb);

// Utilities

/**
 * Removes attribute type map from objects returned by DynamoDB
 * e.g. { room_id: { S: "helloworld" } } -> { room_id: "helloworld" }
 */
const unmarshall = aws.DynamoDB.Converter.unmarshall;

/**
 * Converts objects to DynamoDB attribute type map format
 * e.g. { room_id: "helloworld" } -> { room_id: { S: "helloworld" } }
 */
const marshall = aws.DynamoDB.Converter.marshall;

export { query, putItem, deleteItem, unmarshall, marshall };

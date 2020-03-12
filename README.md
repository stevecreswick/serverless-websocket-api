# Stream Orchestrator State Update Websockets

The Stream Update Websockets API publishes updated stream data to all open websocket connections.

```sh
$product=so-update-websockets
```

Note: The stack is deployed as so-update-websockets. IAM Roles can only be 64 characters, so the stack name cannot be as long as the name of the repo, or it throws errors when generating lambda roles.

## Setup

---

### 1. Install Node Modules

```sh
npm install
```

### 2. Install Local DynamoDB

You will need to install DynamoDB local if you want to use Serverless Offline for local development.
This requires that you have serverless on your machine and Java Runtime Engine.

```sh
sls dynamodb install --product=$product
```

For more help with installation see: [Serverless DynamoDB Local](https://github.com/99xt/serverless-dynamodb-local)

## Local Development

---

Local development leverages Serverless Offline and Serverless DynamoDB Local. Otherwise a full deployment to AWS would be required for any local dev work. Deployment of a test API should still be used to ensure everything works in AWS' actual ecosystem.

Websocket support is still fairly new to Serverless Offline, so there might be buggy behavior.

### 1. Starting the Service

In order to start local development run the following.

```sh
serverless offline start --product=$product`.
```

- Serverless offline allows you to omit the word start on the command line, but if you omit the word start, the local DynamoDB server will not spin up.

### 2. Connecting to the Service Locally

Serverless offline does not support the `wss://` protocol currently.
During local development all connections must be made over `ws://`

```sh
wscat -c "ws://localhost:3001?stream_id={stream_id}"
```

For More information visit: [Serverless API Gateway Offline](https://github.com/dherault/serverless-offline#websocket)

### 3. Querying the Local DynamoDB Tables

To access the local DynameDB go to the console located at, http://localhost:8000/shell/
The DynamoDB terminal allows you to use the Node SDK to interact with the local DB.

```js
// Initialize DynamoDB
const dynamodb = new AWS.DynamoDB({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
});

// Operations
// List Tables
dynamodb.listTables({}, (err, data) => {
  if (err) console.log(err);
  else console.log(data);
});

// Find Connections for a Stream
const params = {
  ExpressionAttributeValues: {
    ':stream_id': {
      S: streamId
    }
  },
  KeyConditionExpression: 'stream_id = :stream_id',
  TableName: 'connections-local'
};

dynamodb.query(params, function(err, data) {
  if (err) console.log(err, err.stack);
  else console.log(data);
});
```

### Additional Notes

If Serverless offline crashes you sometimes have to find and kill the process dynamoDB is running on.

```sh
lsof -i tcp:8000
kill -9 <process_id>
```

You can get more output from Serverless for debugging by exporting the following:

```sh
export SLS_DEBUG=true
```

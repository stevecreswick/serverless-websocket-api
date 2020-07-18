// Lambda ENVs

const TEST_SERVICE_NAME = 'serverless-websocket-api';
const TEST_STAGE = 'test';

// This is used before any beforeEach is run, so needs to be set initially
process.env.STAGE = TEST_STAGE;
process.env.SERVICE = TEST_SERVICE_NAME;

export { TEST_SERVICE_NAME, TEST_STAGE };

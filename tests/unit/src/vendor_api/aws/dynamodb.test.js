jest.mock('util', () => {
  return {
    promisify: jest.fn().mockImplementation(fn => {
      return { bind: jest.fn().mockReturnValue(fn) };
    })
  };
});

jest.mock('aws-sdk');

describe('Vendor API', () => {
  describe('AWS DynamoDB', () => {
    let aws;
    beforeEach(() => {
      process.env.STAGE = 'local';
      aws = require('aws-sdk');
    });

    afterEach(() => {
      jest.resetModules();
    });

    it('initialize with local options if local', () => {
      process.env.STAGE = 'local';

      require('vendor_api/aws/dynamodb').putItem;

      const options = { apiVersion: '2012-10-08' };
      const localOptions = {
        endpoint: 'http://localhost:8000',
        region: 'localhost'
      };

      expect(aws.DynamoDB).toBeCalledWith({ ...options, ...localOptions });
    });

    it.each([['stage'], ['prod']])('initialize normally if stage is %p', stage => {
      process.env.STAGE = stage;

      require('vendor_api/aws/dynamodb').putItem;

      const options = { apiVersion: '2012-10-08' };

      expect(aws.DynamoDB).toBeCalledWith(options);
    });
  });
});

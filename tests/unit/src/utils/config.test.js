describe('Config', () => {
  let orig;
  beforeEach(() => {
    orig = process.env.STAGE;
  });
  afterEach(() => {
    process.env.STAGE = orig;
    jest.resetModules();
  });

  describe('#isLocalEnvironment', () => {
    let config;

    const values = [
      ['local', true],
      ['stage', false],
      ['prod', false]
    ];

    it.each(values)('returns right value for %s', (envName, expected) => {
      process.env.STAGE = envName;

      // imports need to be at top, and i need to require file here, so using require
      config = require('utils/config').default;

      expect(config.isLocalEnvironment()).toEqual(expected);
    });
  });

  describe('#get', () => {
    const service = 'websockets';
    let config;
    const orig = process.env.SERVICE;

    beforeEach(() => {
      process.env.SERVICE = service;
      // imports need to be at top, and i need to require file here, so using require
      config = require('utils/config');
    });

    afterEach(() => {
      process.env.SERVICE = orig;
    });

    it('gets values', () => {
      expect(config.default.get('service')).toEqual(service);
    });

    it('is strict by default', () => {
      expect(() => {
        config.default.get('fake');
      }).toThrow('Unable to find fake');
    });

    it('will handle strict being turned off', () => {
      expect(config.default.get('fake', false)).toEqual(undefined);
    });
  });
});

import _ from 'lodash';
import jsonConfig from 'config';

export default {
  /**
   * @returns {boolean}
   */
  isLocalEnvironment() {
    return this.get('stage') === 'local';
  },

  /**
   * @param {string} key - what key to look for in config
   * @param {boolean} strict
   * @throws {Error} when strict is true
   * @returns {any}
   */
  get(key, strict = true) {
    const value = _.get(jsonConfig, key, undefined);
    if (value === undefined && strict) {
      throw new Error(`Unable to find ${key}`);
    }
    return value;
  }
};

const Collection = require('../util/Collection');

module.exports = class Config extends Collection {
  constructor(client, defaults) {
    super();
    this.client = client;
    this.defaults = defaults;
  }

  set(key, value) {
    if (!key || typeof key !== 'string') {
      throw new TypeError('Key argument must be a string.');
    }
    if (typeof value !== 'object') {
      throw new TypeError('Value option must be an object.');
    }
    const { prefix, splitArgs } = value;
    if (prefix === undefined) value.prefix = this.get(key).prefix;
    if (
      typeof prefix === 'object' &&
      !(prefix instanceof RegExp) &&
      !(prefix instanceof Array)
    ) {
      throw new TypeError(
        'Prefix option must be a string or regular expression or array.'
      );
    }
    if (
      splitArgs !== undefined &&
      splitArgs !== null &&
      splitArgs !== 'string' &&
      splitArgs !== 'object' &&
      typeof splitArgs === 'object' &&
      typeof splitArgs.test !== 'function'
    ) {
      throw new TypeError(
        'SplitArgs option must be a string, undefined, null or regular expression.'
      );
    }
    return super.set(key, { ...this.defaults, ...value, _settingKey: key });
  }

  add(key, value) {
    const { prefix } = value;
    if (prefix) {
      if (
        typeof prefix === 'object' &&
        !(prefix instanceof RegExp) &&
        !(prefix instanceof Array)
      ) {
        throw new TypeError(
          'Prefix option must be a string or regular expression or array.'
        );
      }
      const thisPrefix = this.get(key).prefix;
      if (typeof prefix === 'object') {
        if (prefix instanceof Array) {
          if (typeof thisPrefix === 'object' && thisPrefix instanceof Array) {
            value.prefix = [...thisPrefix, ...prefix];
          } else {
            value.prefix = [thisPrefix, ...prefix];
          }
        }
      } else if (
        typeof thisPrefix === 'object' &&
        thisPrefix instanceof Array
      ) {
        value.prefix = [...thisPrefix, prefix];
      } else {
        value.prefix = [thisPrefix, prefix];
      }
    }
    return super.set(key, { ...this.defaults, ...value, _settingKey: key });
  }

  get(key) {
    if (!key) return this.defaults;
    return this.find(e => e._settingKey === key) || this.defaults;
  }
};

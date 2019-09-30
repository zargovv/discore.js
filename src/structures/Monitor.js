const Base = require('./Base');

const defaultOptions = {};

/**
 * @extends {Base}
 */
module.exports = class Monitor extends Base {
  constructor(client, store, fullpath, options = {}) {
    super(client, store, 'monitor', fullpath, options);
    /**
     * @name Monitor#_options
     * @type {Object}
     * @private
     */
    this._options = { ...defaultOptions, ...this._options };
  }
};

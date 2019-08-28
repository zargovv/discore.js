const Base = require('./Base');

const defaultOptions = {};

/**
 * @extends {Base}
 */
module.exports = class Trigger extends Base {
  constructor(client, store, fullpath, options = {}) {
    super(client, store, 'trigger', fullpath, options);
    /**
     * @name Trigger#_options
     * @type {Object}
     * @private
     */
    this._options = { ...defaultOptions, ...this._options };
  }
};

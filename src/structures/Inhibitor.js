const Base = require('./Base');

const defaultOptions = {};

/**
 * @extends {Base}
 */
module.exports = class Inhibitor extends Base {
  constructor(client, store, fullpath, options = {}) {
    super(client, store, 'inhibitor', fullpath, options);
    /**
     * @name Inhibitor#_options
     * @type {Object}
     * @private
     */
    this._options = { ...defaultOptions, ...this._options };
  }

  /**
   * @param  {...any} args
   * @async
   * @private
   */
  async _run(...args) {
    let bool = false;
    if (this.enabled) {
      if (this.run.constructor.name === 'AsyncFunction') {
        bool = await this.run(...args);
      } else {
        bool = this.run(...args);
      }
    } else if (this.disabledRun.constructor.name === 'AsyncFunction') {
      bool = await this.disabledRun(...args);
    } else {
      bool = this.disabledRun(...args);
    }
    if (this.once) this.unload();
    return Boolean(bool);
  }
};

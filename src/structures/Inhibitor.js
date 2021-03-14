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
    const runFunc = this.enabled ? 'run' : 'disabledRun';
    const res = this[runFunc](...args);
    bool = res instanceof Promise ? await res : res;
    if (this.once) this.unload();
    return Boolean(bool);
  }
};

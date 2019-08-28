const path = require('path');

const defaultOptions = {
  enabled: true,
  key: null,
  name: null,
  id: undefined,
  once: false,
};

module.exports = class Base {
  constructor(client, store, type, fullpath, options = {}) {
    this.client = client;
    this.store = store;
    const childOptions = this.settings || this.options || {};
    if (typeof childOptions !== 'object') {
      const err = 'Options must return an object.';
      return this.client.emit('error', err);
    }
    const customOptions = {
      ...(this.cOptions || {}),
      ...(this.customOptions || {}),
    };
    this.custom = customOptions;
    options = { ...defaultOptions, ...childOptions, ...options };
    /**
     * @name Base#_options
     * @type {Object}
     * @private
     */
    this._options = options;
    this._id = this.client.uniqid.gen();
    this.id = options.id;
    if (!this.id) this.id = this._id;
    if (this.store.find(e => e.id === this.id)) {
      const err = `Event with id ${this.id} is already exists`;
      return this.client.emit('error', err);
    }
    this.dir = path.dirname(fullpath);
    this.file = path.basename(fullpath);
    this.type = type;
    this.enabled = this._options.enabled;
    this.once = this._options.once;
    this.key =
      this._options.key ||
      this._options.name ||
      this.file
        .split('.')
        .slice(0, -1)
        .join('.');
    this.name = this.key;
  }

  /**
   * @param {...any} ...args
   * @private
   * @async
   * @private
   */
  _run(...args) {
    if (this.enabled) this.run(...args);
    else this.disabledRun(...args);
    if (this.once) this.unload();
  }

  /**
   *
   */
  run() {
    const err = 'Run method must be defined';
    this.client.emit('error', err);
  }

  /**
   *
   */
  disabledRun() {}

  /**
   * @returns {Base}
   */
  toggle() {
    if (this.enabled) this.enabled = false;
    if (!this.enabled) this.enabled = true;
    this.client.emit(`${this.type}Toggled`, this);
    return this;
  }

  /**
   * @returns {Base}
   */
  unload(emit = true) {
    if (typeof this._unload === 'function') this._unload();
    this.client.uniqid.delete(this._id);
    this.store.delete(this.id);
    if (emit) this.client.emit(`${this.type}Unloaded`, this);
    return this;
  }

  /**
   * @returns {Base}
   */
  reload() {
    this.unload(false);
    this.store.init(null, null, path.join(this.dir, this.file));
    this.client.emit(`${this.type}Reloaded`, this);
    return this;
  }

  /**
   * @returns {Base}
   */
  disable() {
    const isEnabled = this.enabled;
    this.enabled = false;
    if (isEnabled) this.client.emit(`${this.type}Disabled`, this);
    return this;
  }

  /**
   * @returns {Base}
   */
  enable() {
    const isEnabled = this.enabled;
    this.enabled = true;
    if (!isEnabled) this.client.emit(`${this.type}Enabled`, this);
    return this;
  }

  /**
   * @returns {String} Name
   */
  toString() {
    return this.key;
  }

  /**
   * @private
   */
  _init() {
    return this.init();
  }

  /**
   *
   */
  init() {}
};

const mongoose = require('mongoose');
const Model = require('../util/Model');
const Types = require('../util/Types');

class Mongo {
  constructor(url, options = {}) {
    /**
     * @name Mongo#_models
     * @type {Array<Model>}
     * @private
     */
    this._models = [];
    this.connection = mongoose.connection;
    if (typeof url !== 'string') {
      const text = `First argument must be a string. Instead got ${typeof url}`;
      throw new TypeError(text);
    }
    if (typeof options !== 'object') {
      const text = `Second argument must be an object. Instead got ${typeof options}`;
      throw new TypeError(text);
    }
    const defaultOptions = {
      useNewUrlParser: true,
      autoIndex: false,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4,
    };
    options = { ...defaultOptions, ...options };
    this.url = url;
    this.defaultOptions = defaultOptions;
    this.options = options;
    mongoose.connect(url, options);
    mongoose.Promise = global.Promise;
  }

  /**
   * @returns {*}
   */
  close() {
    return this.connection.close();
  }

  /**
   * @param {String} url
   * @param {Object} options
   * @returns {*}
   */
  open(url, options) {
    if (!url) url = this.url;
    if (typeof url !== 'string') {
      throw new TypeError('Mongo uri must be a string.');
    }
    if (typeof options !== 'object') options = this.options;
    this.url = url;
    return this.connection.openUri(url, options);
  }

  /**
   * @param {String} name
   * @param {Object} options
   * @returns {Mongo} db
   * @example db.addModel('modelname', {
   *  id: { type: String, default: undefined },
   *  messageCount: { type: Number, default: 0 },
   * });
   */
  addModel(name, options) {
    if (typeof name !== 'string') {
      const text = `First argument must be a string. Instead got ${typeof name}`;
      throw new TypeError(text);
    }
    if (this._models.includes(name)) {
      const text = `Model with name ${name} already exists`;
      throw new ReferenceError(text);
    }
    if (typeof options !== 'object') {
      const text = `Second argument must be an object. Instead got ${typeof options}`;
      throw new TypeError(text);
    }
    const defaultOptions = {};
    for (const key in options) {
      if ({}.hasOwnProperty.call(options, key)) {
        if (typeof options[key].type === 'function') {
          options[key].type = options[key].type();
        }
        if (!options[key].type.db.includes('mongo')) {
          throw new Error('Used sql data type for no-sql.');
        }
        defaultOptions[key] = options[key].default;
        options[key] = options[key].type.mongoType;
      }
    }
    this._models.push(name);
    this[name] = new Model(name.toLowerCase(), options, defaultOptions);
    return this;
  }

  static get Types() {
    for (const key in Types) {
      if ({}.hasOwnProperty.call(Types, key)) {
        if (!Types[key]().db.includes('mongo')) delete Types[key];
      }
    }
    return Types;
  }
}

module.exports = Mongo;

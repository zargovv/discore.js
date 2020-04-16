const mongoose = require('mongoose');
const MongoModel = require('../util/MongoModel');
const Types = require('../util/Types');
const Collection = require('../util/Collection');

module.exports = class Mongo {
  constructor(url, options = {}) {
    this.collections = new Collection();
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
      useUnifiedTopology: true,
      autoIndex: false,
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
    if (
      [...this.collections.keys()]
        .map((k) => k.toLowerCase())
        .includes(name.toLowerCase())
    ) {
      const text = `Model with name ${name} already exists`;
      throw new ReferenceError(text);
    }
    if (typeof options !== 'object') {
      const text = `Second argument must be an object. Instead got ${typeof options}`;
      throw new TypeError(text);
    }
    const defaultOptions = {};
    for (const key of Object.keys(options)) {
      let type;
      let defaults;
      if (typeof options[key] === 'function') type = options[key];
      if (!type && typeof options[key].type === 'function') {
        type = options[key].type;
        defaults = options[key].default || undefined;
      }
      type = type();
      if (!type.db.includes('mongo')) {
        throw new Error('Sql data types are not allowed for no-sql.');
      }
      defaultOptions[key] = defaults;
      options[key] = type.mongoType;
    }
    this.collections.set(
      name,
      new MongoModel(
        this.connection,
        name.toLowerCase(),
        options,
        defaultOptions
      )
    );
    return this;
  }

  getCollection(name) {
    return this.collections.get(name);
  }

  static get Types() {
    for (const key in Types) {
      if ({}.hasOwnProperty.call(Types, key)) {
        if (!Types[key]().db.includes('mongo')) delete Types[key];
      }
    }
    return Types;
  }
};

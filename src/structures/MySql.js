const { EventEmitter } = require('events');
const mysql = require('mysql');
const SqlModel = require('../util/SqlModel');
const Types = require('../util/Types');
const Collection = require('../util/Collection');

module.exports = class MySql extends EventEmitter {
  constructor(url) {
    this.collections = new Collection();
    this.url = url;
    this.open(url);
  }

  /**
   * @returns {*}
   */
  close() {
    this.emit('disconnect');
    return this.db.end();
  }

  /**
   * @param {String} url
   * @param {Object} options
   * @returns {*}
   */
  open(url) {
    if (!url) url = this.url;
    // if (typeof url !== 'string') {
    //   throw new TypeError('MySql uri must be a string.');
    // }
    this.url = url;
    this.db = mysql.createConnection(this.url);
    return new Promise((res, rej) => {
      this.db.connect((err) => {
        if (err) {
          this.emit('error', err);
          return rej(err);
        }
        this.emit('connect');
        res(this.db);
      });
    });
  }

  /**
   * @param {String} name
   * @param {Object} options
   * @returns {MySql} db
   * @example db.addModel('modelname', {
   *  id: { type: String, default: undefined },
   *  messageCount: { type: Number, default: 0 },
   * });
   */
  addModel(name, options) {
    if (typeof name !== 'string') {
      throw new TypeError('Name argument must be a string.');
    }
    if (
      [...this.collections.keys()]
        .map((k) => k.toLowerCase())
        .includes(name.toLowerCase())
    ) {
      throw new ReferenceError(`Model with name ${name} already exists`);
    }
    if ({}.hasOwnProperty.call(this, name)) {
      throw new ReferenceError(`Couldn't create model with name ${name}.`);
    }
    if (typeof options !== 'object') {
      throw new TypeError('Options argument must be an object.');
    }
    const defaultOptions = {};
    for (const key of Object.keys(options)) {
      let type;
      let defaults;
      if (typeof options[key] === 'function') type = options[key];
      if (typeof options[key].type === 'function') {
        type = options[key].type;
        defaults = options[key].default || undefined;
      }
      type = type();
      if (!type.db.includes('mysql')) {
        throw new Error('No-sql data types are not allowed in sql.');
      }
      defaultOptions[key] = defaults;
      options[key] = type.mySqlType;
    }
    options._id = 'VARCHAR(20)';
    defaultOptions._id = undefined;
    this.collections.set(
      name,
      new SqlModel(this.db, name.toLowerCase(), options, defaultOptions)
    );
    return this;
  }

  getCollection(name) {
    return this.collections.get(name);
  }

  static get Types() {
    for (const key in Types) {
      if ({}.hasOwnProperty.call(Types, key)) {
        if (!Types[key]().db.includes('mysql')) delete Types[key];
      }
    }
    return Types;
  }
};

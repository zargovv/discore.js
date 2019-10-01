const { EventEmitter } = require('events');
const mysql = require('mysql');
const Model = require('../util/SqlModel');
const Types = require('../util/Types');

class MySql {
  constructor(url) {
    // TODO: Options
    /**
     * @name MySql#_models
     * @type {Array<Model>}
     * @private
     */
    this._models = [];
    this.url = url;
    this.emitter = new EventEmitter();
    this.open(url);
  }

  /**
   * @returns {*}
   */
  close() {
    this.emitter.emit('disconnected', this);
    return this.db.end();
  }

  /**
   * @param {String} url
   * @param {Object} options
   * @returns {*}
   */
  open(url) {
    if (!url) url = this.url;
    if (typeof url !== 'string') {
      throw new TypeError('MySql uri must be a string.');
    }
    this.url = url;
    this.db = mysql.createConnection(this.url);
    return new Promise((res, rej) => {
      this.db.connect(err => {
        if (err) {
          this.emitter.emit('error', err);
          return rej(err);
        }
        this.emitter.emit('connected', this);
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
    if (this._models.find(e => e.toLowerCase() === name.toLowerCase())) {
      throw new ReferenceError(`Model with name ${name} already exists`);
    }
    if ({}.hasOwnProperty.call(this, name)) {
      throw new ReferenceError(`Couldn't create model with name ${name}.`);
    }
    if (typeof options !== 'object') {
      throw new TypeError('Options argument must be an object.');
    }
    const defaultOptions = {};
    for (const key in options) {
      if ({}.hasOwnProperty.call(options, key)) {
        if (typeof options[key].type === 'function') {
          options[key].type = options[key].type();
        }
        if (!options[key].type.db.includes('mysql')) {
          throw new Error('Used no-sql data type for sql.');
        }
        defaultOptions[key] = options[key].default;
        options[key] = options[key].type.mySqlType;
      }
    }
    options._id = 'VARCHAR(20)';
    defaultOptions._id = undefined;
    this._models.push(name);
    this[name] = new Model(
      this.db,
      name.toLowerCase(),
      options,
      defaultOptions
    );
    return this;
  }

  static get Types() {
    for (const key in Types) {
      if ({}.hasOwnProperty.call(Types, key)) {
        if (!Types[key]().db.includes('mysql')) delete Types[key];
      }
    }
    return Types;
  }
}

module.exports = MySql;

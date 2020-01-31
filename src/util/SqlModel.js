const { EventEmitter } = require('events');
const Collection = require('./Collection');
const UniqueId = require('./UniqueId');

module.exports = class SQLModel {
  constructor(db, name, options = {}, defaults = {}) {
    if (typeof name !== 'string') {
      const text = `First argument must be a string. Instead got ${typeof name}`;
      throw new TypeError(text);
    }
    name = name.toLowerCase();
    this.emitter = new EventEmitter();
    this.db = db;
    this.defaults = defaults;
    this.name = name;
    const tableOptions = [];
    let primary = null;
    for (const key in options) {
      if ({}.hasOwnProperty.call(options, key)) {
        tableOptions.push({ key, name: key, type: options[key] });
        if (options[key].primary) primary = key;
      }
    }
    if (primary) tableOptions.push(`PRIMARY KEY (${primary})`);
    this.options = options;
    new Promise((res, rej) => {
      this.db
        .query(
          `CREATE TABLE IF NOT EXISTS ${this.name} (${tableOptions
            .map(e => `${e.key} ${e.type}`)
            .join(', ')})`
        )
        .on('error', err => rej(err))
        .on('end', () => res(this.emitter.emit('connected', this)));
    });
    this.collection = new Collection();
    this.emitter.on('connected', () => this._toCollection());
  }

  /**
   * @returns {Collection}
   * @async
   */
  async getAll() {
    const col = new Collection();
    let data = [];
    try {
      data = await new Promise((res, rej) => {
        const docs = [];
        this.db
          .query(`SELECT * FROM ${this.name}`)
          .on('result', doc => docs.push({ ...doc }))
          .on('error', err => rej(err))
          .on('end', () => res(docs));
      });
    } catch (err) {
      throw new Error(err);
    }
    if (!data) return col;
    for (const val of data) {
      col.set(val._id, val);
    }
    return col;
  }

  /**
   * @private
   */
  async _toCollection() {
    this.collection = await this.getAll();
  }

  /**
   * @property {function|object|*} query
   * @property {*} value
   * @returns {Boolean}
   * @example model.hasOne({ id: '1' });
   * @example model.hasOne(value => value.id === '1');
   * @example model.hasOne('id', '1');
   */
  hasOne(query, value) {
    return !!this.collection.find(query, value);
  }

  /**
   * @property {function|object|*} query
   * @property {*} value
   * @returns {*}
   * @example model.findOne({ id: '1' });
   * @example model.findOne(value => value.id === '1');
   * @example model.findOne('id', '1');
   */
  findOne(query, value) {
    const data = this.collection.find(query, value);
    if (data && data._id) data._id = data._id;
    return data ? { ...this.defaults, ...data } : this.defaults;
  }

  /**
   * @property {*} data
   * @returns {*} data
   * @example model.insertOne({ id: '1' });
   * @async
   */
  insertOne(data) {
    if (typeof data !== 'object') {
      const text = `First argument must be an object. Instead got ${typeof data}`;
      throw new TypeError(text);
    }
    data = { ...this.defaults, ...data };
    if (!data._id) data._id = new UniqueId().toString();
    this.collection.set(data._id, data);
    const insertData = [];
    const toInsert = { ...this.defaults, ...data };
    const typeRegEx = /((^VARCHAR)|(^((TINY)|(LONG)|(MEDIUM))?TEXT))(\(.+\))?$/;
    for (const key in toInsert) {
      if ({}.hasOwnProperty.call(toInsert, key)) {
        if (!toInsert[key]) toInsert[key] = 'NULL';
        else if (new RegExp(typeRegEx.source, 'i').test(this.options[key])) {
          toInsert[key] = `'${toInsert[key]}'`;
        }
        insertData.push({ key, value: data[key], name: key });
      }
    }
    return new Promise((res, rej) => {
      this.db
        .query(
          `INSERT INTO ${this.name} (${insertData
            .map(e => `\`${e.key}\``)
            .join(', ')}) VALUES (${insertData
            .map(e => `'${e.value}'`)
            .join(', ')})`
        )
        .on('error', err => rej(err))
        .on('result', () => res(data));
    });
  }

  /**
   * @property {function|object|*} query
   * @property {*} value
   * @returns {*} Deleted data.
   * @example model.deleteOne({ id: '1' });
   * @async
   */
  deleteOne(query, value) {
    if (typeof query === 'string') {
      if (typeof value === 'undefined') {
        const text = 'Value must be specified.';
        throw new Error(text);
      }
      const prop = query;
      query = {};
      query[prop] = value;
    }
    if (typeof query !== 'object' && typeof query !== 'function') {
      const text = `First argument must be an object, function or string. Instead got ${typeof query}.`;
      throw new TypeError(text);
    }
    if (!this.hasOne(query)) return null;
    const data = this.findOne(query);
    if (!data) return null;
    this.collection.delete(data._id);
    return new Promise((res, rej) => {
      this.db
        .query(`DELETE FROM ${this.name} WHERE _id = '${data._id}'`)
        .on('result', () => res(data))
        .on('error', err => rej(err));
    });
  }

  /**
   * @property {function|object|*} query
   * @property {*} value Value or data.
   * @property {*} newData
   * @returns {*} Updated data.
   * @example model.updateOne({ id: '1' }, { id: '2' });
   * @example model.updateOne(value => value.id === '1', { id: '2' });
   * @example model.updateOne('id', '1', { id: '2' });
   * @async
   */
  updateOne(query, value, newData) {
    if (typeof query === 'string') {
      if (typeof value === 'undefined') {
        const text = 'Value must be specified.';
        throw new Error(text);
      }
      const prop = query;
      query = {};
      query[prop] = value;
      value = newData;
    }
    if (typeof value !== 'object') {
      const text = `Data must be an object. Instead got ${typeof value}`;
      throw new TypeError(text);
    }
    if (typeof query !== 'object' && typeof query !== 'function') {
      const text = `First argument must be an object, function or string. Instead got ${typeof query}`;
      throw new TypeError(text);
    }
    if (!this.hasOne(query)) return null;
    const data = this.findOne(query);
    this.collection.set(data._id, {
      ...data,
      ...value,
    });
    const updateData = [];
    const typeRegEx = /((^VARCHAR)|(^((TINY)|(LONG)|(MEDIUM))?TEXT))(\(.+\))?$/;
    for (const key in value) {
      if ({}.hasOwnProperty.call(value, key)) {
        if (!value[key]) value[key] = 'NULL';
        else if (new RegExp(typeRegEx.source, 'i').test(this.options[key])) {
          value[key] = `'${value[key]}'`;
        }
        updateData.push({ key, name: key, value: value[key] });
      }
    }
    return new Promise((res, rej) => {
      this.db
        .query(
          `UPDATE ${this.name} SET ${updateData
            .map(e => `${e.key} = ${e.value}`)
            .join(', ')} WHERE _id = '${data._id}'`
        )
        .on('result', () => res(data))
        .on('error', err => rej(err));
    });
  }

  /**
   * @property {function|object|*} query
   * @property {*} value Value or data.
   * @property {*} newData
   * @returns {*} Updated / Inserted data.
   * @example model.upsertOne({ id: '1' }, { id: '2' });
   * @example model.upsertOne(value => value.id === '1', { id: '2' });
   * @example model.upsertOne('id', '1', { id: '2' });
   * @async
   */
  async upsertOne(query, value, newData) {
    const updated = await this.updateOne(query, value, newData);
    if (updated) return updated;
    if (typeof query === 'function') query = {};
    if (typeof query === 'string') {
      if (typeof value === 'undefined') {
        const text = 'Value must be specified.';
        throw new Error(text);
      }
      const prop = query;
      query = {};
      query[prop] = value;
      value = newData;
    }
    await this.insertOne({ ...query, ...value });
    return { ...this.defaults, ...query, ...value };
  }
};

const mongoose = require('mongoose');
const Collection = require('./Collection');

module.exports = class Model {
  constructor(name, options = {}, defaults = {}) {
    if (typeof name !== 'string') {
      const text = `First argument must be a string. Instead got ${typeof name}`;
      throw new TypeError(text);
    }
    name = name.toLowerCase();

    this.defaults = defaults;
    this.name = name;
    this._modelName = `${this.name.slice(0, 1).toUpperCase()}${this.name
      .slice(1)
      .toLowerCase()}`;
    this.collection = new Collection();
    this.options = options;
    this.Schema = new mongoose.Schema(this.options);
    this.Model = mongoose.model(this._modelName, this.Schema, this.name);
    this._db = this.Model.db;
    if (this._db.readyState === 1) this._toCollection();
    this._db.on('connected', () => this._toCollection());
  }

  /**
   * @returns {Collection}
   * @async
   */
  async getAll() {
    const col = new Collection();
    const data = await this.Model.find({});
    if (!data) return col;
    for (const val of data) {
      col.set(val._id.toHexString(), {
        ...val._doc,
        _id: val._id.toHexString(),
      });
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
    if (data && data._id) {
      data._id = new mongoose.mongo.ObjectID(data._id);
    }
    return data ? { ...this.defaults, ...data } : this.defaults;
  }

  /**
   * @property {*} data
   * @returns {*} data
   * @example model.insertOne({ id: '1' });
   * @async
   */
  async insertOne(data) {
    if (typeof data !== 'object') {
      const text = `First argument must be an object. Instead got ${typeof data}`;
      throw new TypeError(text);
    }
    data = { ...this.defaults, ...data };
    if (!data._id) data._id = new mongoose.mongo.ObjectID();
    this.collection.set(data._id.toHexString(), {
      ...data,
      _id: data._id.toHexString(),
    });
    await this._db.collection(this.name).insertOne(data);
    return data;
  }

  /**
   * @property {function|object|*} query
   * @property {*} value
   * @returns {*} Deleted data.
   * @example model.deleteOne({ id: '1' });
   * @async
   */
  async deleteOne(query, value) {
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
    this.collection.delete(data._id.toHexString());
    await this._db.collection(this.name).findOneAndDelete({ _id: data._id });
    return data;
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
  async updateOne(query, value, newData) {
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
    this.collection.set(data._id.toHexString(), {
      ...data,
      ...value,
      _id: data._id.toHexString(),
    });
    await this._db
      .collection(this.name)
      .findOneAndUpdate({ _id: data._id }, { $set: value });
    return data;
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

const { EventEmitter } = require('events');
const Collection = require('./Collection');
const SqlDocument = require('./Document');

module.exports = class SqlModel {
  constructor(db, name, options = {}, defaults = {}) {
    if (typeof name !== 'string') {
      const text = `Argument 'name' must be in type of string. Instead got ${typeof name}`;
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
    new Promise((resolve, reject) => {
      this.db
        .query(
          `CREATE TABLE IF NOT EXISTS ${this.name} (${tableOptions
            .map(e => `${e.key} ${e.type}`)
            .join(', ')})`
        )
        .on('error', reject)
        .on('end', () => resolve(this.emitter.emit('connected', this)));
    });
    this.data = new Collection();
    this.emitter.on('connected', () => this.fetch());
  }

  fetch() {
    return new Promise((resolve, reject) => {
      new Promise((res, rej) => {
        const docs = [];
        this.db
          .query(`SELECT * FROM ${this.name}`)
          .on('result', doc => docs.push({ ...doc }))
          .on('error', err => rej(err))
          .on('end', () => res(docs));
      })
        .then(docs => {
          const data = new Collection();
          if (!data) return resolve(data);
          for (const val of docs) data.set(val._id, val);
          resolve(data);
        })
        .catch(reject);
    });
  }

  filterKeys(query, value) {
    if (typeof query === 'string') query = { [query]: value };
    if (typeof query === 'object') {
      const q = query;
      query = doc => Object.keys(q).every(k => doc[k] === q[k]);
    }
    const keys = [];
    for (const [key, value] of this.data) {
      if (query(value, key, this)) keys.push(key);
    }
    return keys;
  }

  filter(query, value) {
    const keys = this.filterKeys(query, value);
    const documents = [];
    for (const key of keys) documents.push(this.data.get(key));
    return documents;
  }

  findKey(query, value) {
    if (typeof query === 'string') query = { [query]: value };
    if (typeof query === 'object') {
      const q = query;
      query = doc => Object.keys(q).every(k => doc[k] === q[k]);
    }
    for (const [key, value] of this.data) {
      if (query(value, key, this)) return key;
    }
    return null;
  }

  findOne(query, value) {
    const key = this.findKey(query, value);
    return key ? this.data.get(key) : null;
  }

  getOne(query, value) {
    if (typeof query === 'string') {
      query = { [query]: value };
    }
    const defaults = {
      ...(typeof query === 'object' ? query : {}),
    };
    return {
      ...this.defaults,
      ...(this.findOne(query, value) || new SqlDocument(defaults)),
    };
  }

  insertOne(data) {
    if (typeof data !== 'object') {
      const text = `First argument must be an object. Instead got ${typeof data}`;
      throw new TypeError(text);
    }
    const document = new SqlDocument({ ...this.defaults, ...data });
    this.data.set(document._id, document);
    const insertData = [];
    const toInsert = { ...document };
    const typeRegEx = /((^VARCHAR)|(^((TINY)|(LONG)|(MEDIUM))?TEXT))(\(.+\))?$/;
    for (const key in toInsert) {
      if ({}.hasOwnProperty.call(toInsert, key)) {
        if (!toInsert[key]) toInsert[key] = 'NULL';
        else if (new RegExp(typeRegEx.source, 'i').test(this.options[key])) {
          toInsert[key] = `'${toInsert[key]}'`;
        }
        insertData.push({ key, value: document[key], name: key });
      }
    }
    this.db
      .query(
        `INSERT INTO ${this.name} (${insertData
          .map(e => `\`${e.key}\``)
          .join(', ')}) VALUES (${insertData
          .map(e => `'${e.value}'`)
          .join(', ')})`
      )
      .on('error', err => {})
      .on('result', () => {});
    return document;
  }

  insertMany(data) {
    const documents = [];
    for (const document of data) documents.push(this.insertOne(document));
    return documents;
  }

  deleteOne(query, value) {
    const key = this.findKey(query, value);
    if (key) {
      const document = this.data.get(key);
      this.data.delete(key);
      this.db
        .query(`DELETE FROM ${this.name} WHERE _id = '${key}'`)
        .on('result', () => {})
        .on('error', err => {});
      return document;
    }
    return null;
  }

  updateOne(query, value, newData = {}) {
    const key = this.findKey(query, value);
    if (!key) return null;
    if (typeof query !== 'string') newData = value;
    const document = this.data.get(key);
    const newDocument = new SqlDocument({
      ...this.defaults,
      ...document,
      ...newData,
    });
    this.data.set(key, newDocument);
    const updateData = [];
    const typeRegEx = /((^VARCHAR)|(^((TINY)|(LONG)|(MEDIUM))?TEXT))(\(.+\))?$/;
    for (const okey of Object.keys(newDocument)) {
      if (!newDocument[okey]) newDocument[okey] = 'NULL';
      else if (new RegExp(typeRegEx.source, 'i').test(this.options[okey])) {
        newDocument[okey] = `'${newDocument[okey]}'`;
      }
      updateData.push({ key: okey, name: okey, value: newDocument[okey] });
    }
    this.db
      .query(
        `UPDATE ${this.name} SET ${updateData
          .map(e => `${e.key} = ${e.value}`)
          .join(', ')} WHERE _id = '${key}'`
      )
      .on('result', () => {})
      .on('error', err => {});
    return newDocument;
  }

  upsertOne(query, value, newData = {}) {
    const key = this.findKey(query, value);
    if (typeof query === 'string') query = { [query]: value };
    if (!key) {
      return this.insertOne({
        ...(typeof query === 'object' ? query : {}),
        ...(typeof query !== 'string' ? value : newData),
      });
    }
    return this.updateOne(query, value, newData);
  }
};

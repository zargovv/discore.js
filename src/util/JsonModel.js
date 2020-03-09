const fs = require('fs');
const Doc = require('./Document');
const Collection = require('./Collection');

module.exports = class JsonModel {
  constructor(db, name, path, defaults) {
    this.db = db;
    this.name = name;
    this.path = path;
    this.defaults = defaults;
    this.data = new Collection();
    this.fetch();
  }

  fetch() {
    let body = {};
    if (fs.existsSync(this.path)) {
      const content = fs.readFileSync(this.path, 'utf8');
      try {
        body = JSON.parse(content);
      } catch (e) {
        body = {};
      }
    }
    Object.keys(body).forEach(key => this.data.set(key, new Doc(body[key])));
    return this.data;
  }

  getData() {
    return this.data;
  }

  save() {
    this.db.save(this.name);
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
    return undefined;
  }

  findOne(query, value) {
    const key = this.findKey(query, value);
    return key ? this.data.get(key) : undefined;
  }

  getOne(query, value) {
    if (typeof query === 'string') query = { [query]: value };
    const defaults = { ...(typeof query === 'object' ? query : {}) };
    return {
      ...this.defaults,
      ...(this.findOne(query, value) || new Doc(defaults)),
    };
  }

  insertOne(data) {
    const document = new Doc({ ...this.defaults, ...data });
    this.data.set(document._id, document);
    this.save();
    return document;
  }

  insertMany(data) {
    const documents = [];
    for (const document of data) {
      documents.push(new Doc({ ...this.defaults, ...document }));
    }
    for (const document of documents) this.data.set(document._id, document);
    this.save();
    return documents;
  }

  deleteOne(query, value) {
    const key = this.findKey(query, value);
    if (key) {
      const document = this.data.get(key);
      this.data.delete(key);
      this.save();
      return document;
    }
    return undefined;
  }

  deleteMany(query, value) {
    const key = this.findKey(query, value);
    if (key) {
      const document = this.data.get(key);
      this.data.delete(key);
      this.save();
      return document;
    }
    return undefined;
  }

  updateOne(query, value, newData = {}) {
    const key = this.findKey(query, value);
    if (!key) return undefined;
    if (typeof query !== 'string') newData = value;
    const document = this.data.get(key);
    const newDocument = new Doc({ ...this.defaults, ...document, ...newData });
    this.data.set(key, newDocument);
    this.save();
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

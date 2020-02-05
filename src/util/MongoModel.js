const Collection = require('./Collection');
const MongoDocument = require('./Document');

module.exports = class MongoModel {
  constructor(db, name, options = {}, defaults = {}) {
    if (typeof name !== 'string') {
      const text = `Argument 'name' must be in type of string. Instead got ${typeof name}`;
      throw new TypeError(text);
    }
    name = name.toLowerCase();
    this.data = new Collection();
    this.defaults = defaults;
    this.name = name;
    this.options = options;
    this.db = db;
    if (this.db.readyState === 1) this.fetch();
    this.db.on('connected', () => this.fetch());
  }

  fetch() {
    return new Promise((resolve, reject) => {
      this.db.collection(this.name).find({}, (err, res) => {
        if (err) return reject(err);
        res.toArray((err, docs) => {
          if (err) return reject(err);
          const data = new Collection();
          for (const val of docs) data.set(val._id, val);
          this.data = data;
          resolve(data);
        });
      });
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
      ...this.defaults,
      ...(typeof query === 'object' ? query : {}),
    };
    return this.findOne(query, value) || new MongoDocument(defaults);
  }

  insertOne(data) {
    const document = new MongoDocument(data);
    this.data.set(document._id, document);
    this.db.collection(this.name).insertOne({ ...document });
    return document;
  }

  insertMany(data) {
    const documents = [];
    for (const document of data) documents.push(new MongoDocument(document));
    for (const document of documents) this.data.set(document._id, document);
    this.db.collection(this.name).insertMany(data);
    return documents;
  }

  deleteOne(query, value) {
    const key = this.findKey(query, value);
    if (key) {
      const document = this.data.get(key);
      this.data.delete(key);
      this.db.collection(this.name).deleteOne({ _id: key });
      return document;
    }
    return null;
  }

  updateOne(query, value, newData = {}) {
    const key = this.findKey(query, value);
    if (!key) return null;
    if (typeof query !== 'string') newData = value;
    const document = this.data.get(key);
    const newDocument = new MongoDocument({ ...document, ...newData });
    this.data.set(key, newDocument);
    this.db
      .collection(this.name)
      .updateOne({ _id: key }, { $set: { ...newDocument } });
    return newDocument;
  }

  upsertOne(query, value, newData = {}) {
    const key = this.findKey(query, value);
    if (typeof query === 'string') query = { [query]: value };
    if (!key) {
      return this.insertOne({
        ...(typeof query === 'object' ? query : {}),
        ...(typeof query === 'string' ? value : newData),
      });
    }
    return this.updateOne(query, value, newData);
  }
};

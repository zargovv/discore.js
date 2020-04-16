const { EventEmitter } = require('events');
const Collection = require('./Collection');
const MongoDocument = require('./Document');

module.exports = class MongoModel extends EventEmitter {
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
    this.state = 0;
  }

  enqueue(action) {
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.state !== 1) {
        self.on('ready', () => resolve(action.call(self)));
        self.on('error', reject);
        return;
      }
      resolve(action.call(self));
    });
  }

  getData() {
    function action() {
      return this.data;
    }
    return this.enqueue(action);
  }

  fetch() {
    return new Promise((resolve, reject) => {
      this.db.collection(this.name).find({}, (err, res) => {
        if (err) {
          if (this.state !== 1) this.emit('error', err);
          return reject(err);
        }
        res.toArray((err, docs) => {
          if (err) {
            if (this.state !== 1) this.emit('error', err);
            return reject(err);
          }
          const data = new Collection();
          for (const val of docs) {
            data.set(
              val._id,
              new MongoDocument(this, { ...this.defaults, ...val })
            );
          }
          this.data = data;
          if (this.state !== 1) {
            this.state = 1;
            this.emit('ready');
          }
          this.emit('fetch', data);
          resolve(data);
        });
      });
    });
  }

  filterKeys(query, value) {
    function action() {
      if (typeof query === 'string') query = { [query]: value };
      if (typeof query === 'object') {
        const q = query;
        query = (doc) => Object.keys(q).every((k) => doc[k] === q[k]);
      }
      const keys = [];
      for (const [key, value] of this.data) {
        if (query(value, key, this)) keys.push(key);
      }
      return keys;
    }
    return this.enqueue(action);
  }

  filter(query, value) {
    return new Promise((resolve, reject) => {
      this.filterKeys(query, value)
        .then((keys) => {
          const documents = [];
          for (const key of keys) documents.push(this.data.get(key));
          resolve(documents);
        })
        .catch(reject);
    });
  }

  findKey(query, value) {
    function action() {
      if (typeof query === 'string') query = { [query]: value };
      if (typeof query === 'object') {
        const q = query;
        query = (doc) => Object.keys(q).every((k) => doc[k] === q[k]);
      }
      for (const [key, value] of this.data) {
        if (query(value, key, this)) return key;
      }
      return undefined;
    }
    return this.enqueue(action);
  }

  findOne(query, value) {
    return new Promise((resolve, reject) => {
      this.findKey(query, value)
        .then((key) => {
          resolve(key ? this.data.get(key) : undefined);
        })
        .catch(reject);
    });
  }

  getOne(query, value) {
    return new Promise((resolve, reject) => {
      if (typeof query === 'string') query = { [query]: value };
      const defaults = { ...(typeof query === 'object' ? query : {}) };
      this.findOne(query, value)
        .then((doc) => {
          resolve(
            new MongoDocument(this, {
              ...this.defaults,
              ...defaults,
              ...(doc ? doc.json() : {}),
            })
          );
        })
        .catch(reject);
    });
  }

  insertOne(data) {
    const document = new MongoDocument(this, { ...this.defaults, ...data });
    this.data.set(document._id, document);
    this.db.collection(this.name).insertOne(document.json());
    this.emit('insert', document);
    return document;
  }

  insertMany(data) {
    const documents = [];
    for (const document of data) {
      documents.push(
        new MongoDocument(this, { ...this.defaults, ...document.json() })
      );
    }
    for (const document of documents) this.data.set(document._id, document);
    this.db.collection(this.name).insertMany(documents.map((d) => ({ ...d })));
    this.emit('insertMany', documents);
    return documents;
  }

  deleteOne(query, value) {
    return new Promise((resolve, reject) => {
      this.findKey(query, value)
        .then((key) => {
          if (key) {
            const document = this.data.get(key);
            this.data.delete(key);
            this.db.collection(this.name).deleteOne({ _id: key });
            this.emit('delete', document);
            return resolve(document);
          }
          resolve(undefined);
        })
        .catch(reject);
    });
  }

  deleteMany(query, value) {
    return new Promise((resolve, reject) => {
      this.filterKeys(query, value)
        .then((keys) => {
          const deleted = keys.map((key) => this.deleteOne({ _id: key }));
          Promise.all(deleted).then((docs) => {
            this.emit('deleteMany', docs);
            resolve(docs);
          });
        })
        .catch(reject);
    });
  }

  updateOne(query, value, newData = {}) {
    return new Promise((resolve, reject) => {
      this.findKey(query, value)
        .then((key) => {
          if (!key) return resolve(undefined);
          if (typeof query !== 'string') newData = value;
          const document = this.data.get(key);
          const newDocument = new MongoDocument(this, {
            ...this.defaults,
            ...document,
            ...newData,
          });
          this.data.set(key, newDocument);
          this.db
            .collection(this.name)
            .updateOne({ _id: key }, { $set: newDocument.json() });
          this.emit('update', document, newDocument);
          resolve(newDocument);
        })
        .catch(reject);
    });
  }

  upsertOne(query, value, newData = {}) {
    return new Promise((resolve, reject) => {
      this.findKey(query, value)
        .then((key) => {
          if (typeof query === 'string') query = { [query]: value };
          if (!key) {
            return resolve(
              this.insertOne({
                ...(typeof query === 'object' ? query : {}),
                ...(typeof query !== 'string' ? value : newData),
              })
            );
          }
          resolve(this.updateOne(query, value, newData));
        })
        .catch(reject);
    });
  }
};

const { EventEmitter } = require('events');
const Collection = require('./Collection');
const SqlDocument = require('./Document');

module.exports = class SqlModel extends EventEmitter {
  constructor(db, name, options = {}, defaults = {}) {
    super();
    if (typeof name !== 'string') {
      const text = `Argument 'name' must be in type of string. Instead got ${typeof name}`;
      throw new TypeError(text);
    }
    name = name.toLowerCase();
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
            .map((e) => `${e.key} ${e.type}`)
            .join(', ')})`
        )
        .on('error', reject)
        .on('end', () => resolve(this.emit('connect')));
    });
    this.data = new Collection();
    this.on('connect', () => this.fetch());
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
      new Promise((res, rej) => {
        const docs = [];
        this.db
          .query(`SELECT * FROM ${this.name}`)
          .on('result', (doc) => docs.push({ ...doc }))
          .on('error', (err) => rej(err))
          .on('end', () => res(docs));
      })
        .then((docs) => {
          const data = new Collection();
          for (const val of docs) {
            data.set(
              val._id,
              new SqlDocument(this, { ...this.defaults, ...val })
            );
          }
          this.data = data;
          if (this.state !== 1) {
            this.state = 1;
            this.emit('ready');
          }
          this.emit('fetch', data);
          resolve(data);
        })
        .catch(reject);
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
            new SqlDocument(this, {
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
    if (typeof data !== 'object') {
      const text = `First argument must be an object. Instead got ${typeof data}`;
      throw new TypeError(text);
    }
    const document = new SqlDocument(this, { ...this.defaults, ...data });
    this.data.set(document._id, document);
    const insertData = [];
    const toInsert = document.json();
    const typeRegEx = /((^VARCHAR)|(^((TINY)|(LONG)|(MEDIUM))?TEXT))(\(.+\))?$/;
    Object.keys(toInsert).forEach((key) => {
      if (!toInsert[key]) toInsert[key] = 'NULL';
      else if (new RegExp(typeRegEx.source, 'i').test(this.options[key])) {
        toInsert[key] = `'${toInsert[key]}'`;
      }
      insertData.push({ key, value: document[key], name: key });
    });
    this.db
      .query(
        `INSERT INTO ${this.name} (${insertData
          .map((e) => `\`${e.key}\``)
          .join(', ')}) VALUES (${insertData
          .map((e) => `'${e.value}'`)
          .join(', ')})`
      )
      .on('error', (err) => {})
      .on('result', () => {});
    this.emit('insert', document);
    return document;
  }

  insertMany(data) {
    const documents = [];
    for (const document of data) documents.push(this.insertOne(document));
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
            this.db
              .query(`DELETE FROM ${this.name} WHERE _id = '${key}'`)
              .on('result', () => {})
              .on('error', (err) => {});
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
          const docs = keys.map((k) => this.data.get(k));
          if (keys.length > 0) {
            keys.forEach(k => this.data.delete(k));
            this.db
              .query(
                `DELETE FROM ${this.name} WHERE _id IN ('${keys.join("', '")}')`
              )
              .on('result', () => {})
              .on('error', (err) => {});
          }
          this.emit('deleteMany', docs);
          resolve(docs);
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
          const newDocument = new SqlDocument(this, {
            ...this.defaults,
            ...document,
            ...newData,
          });
          this.data.set(key, newDocument);
          const updateData = [];
          const typeRegEx = /((^VARCHAR)|(^((TINY)|(LONG)|(MEDIUM))?TEXT))(\(.+\))?$/;
          Object.keys(newDocument.json()).forEach((k) => {
            if (!newDocument[k]) newDocument[k] = 'NULL';
            else if (new RegExp(typeRegEx.source, 'i').test(this.options[k])) {
              newDocument[k] = `'${newDocument[k]}'`;
            }
            updateData.push({
              key: k,
              name: k,
              value: newDocument[k],
            });
          });
          this.db
            .query(
              `UPDATE ${this.name} SET ${updateData
                .map((e) => `${e.key} = ${e.value}`)
                .join(', ')} WHERE _id = '${key}'`
            )
            .on('result', () => {})
            .on('error', (err) => {});
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

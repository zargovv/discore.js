const fs = require('fs');
const path = require('path');
const JsonModel = require('../util/JsonModel');
const Collection = require('../util/Collection');

module.exports = class Json {
  constructor(dirPath) {
    if (typeof dirPath !== 'string') {
      throw new TypeError("'DirPath' argument must be a string.");
    }
    this.path = path.join(
      path.dirname(module.parent.parent.parent.filename),
      dirPath
    );
    this.collections = new Collection();
    this.savingQueue = new Collection();
  }

  addModel(key, modelBody) {
    if (this.collections.has(key)) {
      throw new ReferenceError(`Model with name ${key} already exists.`);
    }
    const model = new JsonModel(
      this,
      key,
      `${this.path}/${key}.json`,
      modelBody
    );
    this.collections.set(key, model);
    return this;
  }

  getCollection(key) {
    // if (!this.collections.has(key)) this.add(key, {});
    return this.collections.get(key);
  }

  save(collection = null) {
    const model = this.collections.get(collection);
    if (!model) return false;
    const data = {};
    for (const [key, val] of model.data) data[key] = val.json();
    this.savingQueue.set(model.name, {
      path: model.path,
      data: JSON.stringify(data),
    });
    this.processQueue();
    return true;
  }

  processQueue() {
    if (!fs.existsSync(this.path)) fs.mkdirSync(this.path);
    for (const [key, value] of this.savingQueue) {
      this.savingQueue.delete(key);
      fs.writeFileSync(value.path, value.data, 'utf8');
    }
    if ([...this.savingQueue.keys()].length > 0) return this.processQueue();
  }
};

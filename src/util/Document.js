const UniqueId = require('./UniqueId');

module.exports = class Document {
  constructor(model, entries = {}) {
    this._model = model;
    if (!entries._id) entries._id = new UniqueId().id;
    this._doc = entries;
    Object.keys(entries).forEach((key) => (this[key] = entries[key]));
  }

  save() {
    return this._model.upsertOne({ _id: this._doc._id }, this.json());
  }

  populate(keys, remove = false) {
    const document = new Document();
    Object.keys(this)
      .filter((key) => remove !== keys.includes(key))
      .forEach((key) => (document[key] = this[key]));
    return document;
  }

  json() {
    const json = { ...this };
    delete json._model;
    delete json._doc;
    return json;
  }
};

const UniqueId = require('./UniqueId');

module.exports = class Document {
  constructor(entries = {}) {
    if (!entries._id) entries._id = new UniqueId().id;
    Object.keys(entries).forEach(key => (this[key] = entries[key]));
  }

  populate(keys, remove = false) {
    const document = new Document();
    Object.keys(this)
      .filter(key => remove !== keys.includes(key))
      .forEach(key => (document[key] = this[key]));
    return document;
  }

  json() {
    return { ...this };
  }
};

const Collection = require('../util/Collection');

module.exports = class PermissionLevels {
  constructor() {
    /**
     * @name PermissionLevels#_id
     * @type {Number}
     * @private
     */
    this._id = 0;
    /**
     * @name PermissionLevels#_collection
     * @type {Collection}
     * @private
     */
    this._collection = new Collection();
    this._collection.set(this._id, { brk: true, fn: () => true });
    this._id += 1;
  }

  _getId() {
    return this._id++;
  }

  /**
   * @param {Number} level Level number
   * @param {Boolean} brk Break
   * @param {Function} fn
   * @returns {PermissionLevels}
   * @example permLvls.addLevel(3, true, msg => msg.author.id === ownerId);
   */
  addLevel(level, brk, fn) {
    if (!level) level = this._getId();
    if (this._collection.has(level)) {
      throw new Error(`Level ${level} already exists.`);
    }
    if (typeof fn !== 'function') {
      throw new TypeError('Fn argument must be a function.');
    }
    brk = Boolean(brk);
    if (typeof brk !== 'boolean') {
      throw new TypeError('Brk argument must be boolean.');
    }
    this._collection.set(level, { brk, fn, level });
    return this;
  }

  async _test(level, message, client) {
    while (!this._collection.has(level)) {
      if (!this._collection.find(e => e.level > level)) return false;
      level += 1;
    }
    const { brk, fn } = this._collection.get(level);
    let res = fn(message, client);
    if (fn.constructor.name === 'AsyncFunction') res = await res;
    if (res) return res;
    if (!brk) return this._test(level + 1, message, client);
    return false;
  }

  /**
   * @param {Number} level
   * @param {Message} message
   * @async
   * @returns {Boolean}
   * @example permLvls.test(3, message);
   */
  async test(level, message, client) {
    if (!this._collection.has(level)) return false;
    const { brk, fn } = this._collection.get(level);
    let res = fn(message, client);
    if (fn.constructor.name === 'AsyncFunction') res = await res;
    res = !!res;
    if (res) return res;
    if (!brk) return this._test(level + 1, message, client);
    return res;
  }

  get length() {
    return this._collection.length;
  }

  /**
   * @param {Number} level Level number
   * @param {Boolean} brk Break
   * @param {Function} fn
   * @returns {PermissionLevels}
   * @example permLvls.add(3, true, msg => msg.author.id === ownerId);
   */
  add(...args) {
    return this.addLevel(...args);
  }
};

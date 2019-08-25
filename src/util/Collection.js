const objFn = {
  every(obj, fn) {
    for (const key in obj) {
      if ({}.hasOwnProperty.call(obj, key)) {
        if (!fn(obj[key], key, obj)) return false;
      }
    }
    return true;
  },
};

/**
 * @extends {Map}
 */
module.exports = class Collection extends Map {
  /**
   * @returns {Array}
   */
  array() {
    return [...this.values()];
  }

  /**
   * @returns {Array}
   */
  keyArray() {
    return [...this.keys()];
  }

  /**
   * @param {number} [count=1]
   * @returns {*|Array<*>}
   * @example collection.first();
   * @example collection.first(10);
   */
  first(count = 1) {
    if (typeof count !== 'number') {
      const text = `The count must be a number. Instead got ${typeof count}.`;
      throw new TypeError(text);
    }
    if (count < 1 || !Number.isInteger(count)) {
      const text = `The count must be an integer greater than 0. Instead got ${count}.`;
      throw new RangeError(text);
    }
    const arr = [...this.values()];
    if (count === 1) return arr[0];
    count = Math.min(count, this.size);
    return arr.slice(0, count);
  }

  /**
   * @param {number} [count=1]
   * @returns {*|Array<*>}
   * @example collection.firstKey();
   * @example collection.firstKey(10);
   */
  firstKey(count = 1) {
    if (typeof count !== 'number') {
      const text = `The count must be a number. Instead got ${typeof count}.`;
      throw new TypeError(text);
    }
    if (count < 1 || !Number.isInteger(count)) {
      const text = `The count must be an integer greater than 0. Instead got ${count}.`;
      throw new RangeError(text);
    }
    const arr = [...this.keys()];
    if (count === 1) return arr[0];
    count = Math.min(count, this.size);
    return arr.slice(0, count);
  }

  /**
   * @param {number} [count=1]
   * @returns {*|Array<*>}
   * @example collection.last();
   * @example collection.last(10);
   */
  last(count = 1) {
    if (typeof count !== 'number') {
      const text = `The count must be a number. Instead got ${typeof count}.`;
      throw new TypeError(text);
    }
    if (count < 1 || !Number.isInteger(count)) {
      const text = `The count must be an integer greater than 0. Instead got ${count}.`;
      throw new RangeError(text);
    }
    const arr = [...this.values()];
    if (count === 1) return arr.slice(-1)[0];
    count = Math.min(count, this.size);
    return arr.slice(-count);
  }

  /**
   * @param {number} [count=1]
   * @returns {*|Array<*>}
   * @example collection.lastKey();
   * @example collection.lastKey(10);
   */
  lastKey(count = 1) {
    if (typeof count !== 'number') {
      const text = `The count must be a number. Instead got ${typeof count}.`;
      throw new TypeError(text);
    }
    if (count < 1 || !Number.isInteger(count)) {
      const text = `The count must be an integer greater than 0. Instead got ${count}.`;
      throw new RangeError(text);
    }
    const arr = [...this.keys()];
    if (count === 1) return arr.slice(-1)[0];
    count = Math.min(count, this.size);
    return arr.slice(-count);
  }

  /**
   * @param {number} [count=1]
   * @returns {*|Array<*>}
   * @example collection.random();
   * @example collection.random(10);
   */
  random(count = 1) {
    if (typeof count !== 'number') {
      const text = `The count must be a number. Instead got ${typeof count}.`;
      throw new TypeError(text);
    }
    if (count < 1 || !Number.isInteger(count)) {
      const text = `The count must be an integer greater than 0. Instead got ${count}.`;
      throw new RangeError(text);
    }
    const arr = [...this.values()];
    if (count === 1) return arr[Math.floor(Math.random() * arr.length)];
    count = Math.min(count, this.size);
    const newArr = [];
    for (let i = 0; i < count; i++) {
      const rand = Math.floor(Math.random() * arr.length);
      newArr.push(arr.splice(rand, 1)[0]);
    }
    return newArr;
  }

  /**
   * @param {number} [count=1]
   * @returns {*|Array<*>}
   * @example collection.randomKey();
   * @example collection.randomKey(10);
   */
  randomKey(count = 1) {
    if (typeof count !== 'number') {
      const text = `The count must be a number. Instead got ${typeof count}.`;
      throw new TypeError(text);
    }
    if (count < 1 || !Number.isInteger(count)) {
      const text = `The count must be an integer greater than 0. Instead got ${count}.`;
      throw new RangeError(text);
    }
    const arr = [...this.keys()];
    if (count === 1) return arr[Math.floor(Math.random() * arr.length)];
    count = Math.min(count, this.size);
    const newArr = [];
    for (let i = 0; i < count; i++) {
      const rand = Math.floor(Math.random() * arr.length);
      newArr.push(arr.splice(rand, 1)[0]);
    }
    return newArr;
  }

  /**
   * @param {Function|Object|String} query
   * @param {String} [value]
   * @returns {Array<*>}
   * @example collection.findAll(member => member.roles.has(role.id));
   */
  findAll(query, value) {
    if (typeof query === 'string') {
      if (typeof value === 'undefined') {
        const text = 'Value must be specified.';
        throw new Error(text);
      }
      const prop = {};
      prop[query] = value;
      query = prop;
    }
    const arr = [];
    if (typeof query === 'function') {
      for (const [key, val] of this) {
        if (query(val, key, this)) arr.push(val);
      }
    } else if (typeof query === 'object') {
      for (const val of this.values()) {
        if (objFn.every(query, (value, key) => value === val[key])) {
          arr.push(val);
        }
      }
    } else {
      const text = `First argument must be an object, function or string. Instead got ${typeof query}`;
      throw new TypeError(text);
    }
    return arr;
  }

  /**
   * @param {Function|Object|String} query
   * @param {String} [value]
   * @returns {*}
   * @example collection.find(user => user.discriminator === '0001');
   */
  find(query, value) {
    if (typeof query === 'string') {
      if (typeof value === 'undefined') {
        const text = 'Value must be specified';
        throw new Error(text);
      }
      const prop = {};
      prop[query] = value;
      query = prop;
    }
    if (typeof query === 'function') {
      for (const [key, val] of this) {
        if (query(val, key, this)) return val;
      }
    } else if (typeof query === 'object') {
      for (const val of this.values()) {
        if (objFn.every(query, (value, key) => value === val[key])) {
          return val;
        }
      }
    } else {
      const text = `First argument must be a function, object or string. Instead got ${typeof query}.`;
      throw new TypeError(text);
    }
    return null;
  }

  /**
   * @param {Function|Object|String} query
   * @param {String} [value]
   * @returns {*}
   * @example collection.findKey(user => user.discriminator === '0001');
   */
  findKey(query, value) {
    if (typeof query === 'string') {
      if (typeof value === 'undefined') {
        const text = 'Value must be specified';
        throw new Error(text);
      }
      const prop = {};
      prop[query] = value;
      query = prop;
    }
    if (typeof query === 'function') {
      for (const [key, val] of this) {
        if (query(val, key, this)) return key;
      }
    } else if (typeof query === 'object') {
      for (const [key, val] of this) {
        if (objFn.every(query, (value, key) => value === val[key])) {
          return key;
        }
      }
    } else {
      const text = `First argument must be a function, object or string. Instead got ${typeof query}.`;
      throw new TypeError(text);
    }
    return null;
  }

  /**
   * @param {Function|Object|String} query
   * @param {String} [value]
   * @returns {Boolean}
   * @example collection.exists(user => user.discriminator === '0001');
   */
  exists(query, value) {
    return !!this.find(query, value);
  }

  /**
   * @param {Function} fn
   * @param {*} [thisArg]
   * @returns {number} Count of deleted entries
   * @example collection.sweep(user => user.discriminator === '0001');
   */
  sweep(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const size = this.size;
    for (const [key, val] of this) {
      if (fn(val, key, this)) this.delete(key);
    }
    return size - this.size;
  }

  /**
   * @param {Function} fn
   * @param {*} [thisArg]
   * @returns {Collection} Filtered collection
   * @example collection.filter(user => user.discriminator === '0001');
   */
  filter(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const col = new Collection();
    for (const [key, val] of this) {
      if (fn(val, key, this)) col.set(key, val);
    }
    return col;
  }

  /**
   * @param {Function} fn
   * @param {*} [thisArg]
   * @returns {Array<*>} Filtered array of values
   * @example collection.filterArray(user => user.discriminator === '0001');
   */
  filterArray(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const arr = [];
    for (const [key, val] of this) {
      if (fn(val, key, this)) arr.push(val);
    }
    return arr;
  }

  /**
   * @param {Function} fn
   * @param {*} [thisArg]
   * @returns {Array<*>} Filtered array of values
   * @example collection.filterArr(user => user.discriminator === '0001');
   */
  filterArr(...args) {
    return this.filterArray(...args);
  }

  /**
   * @param {Function} fn
   * @param {*} [thisArg]
   * @returns {Array<Collection>}
   * @example const [more, less] = collection.partition(guild => guild.channels.size > 25);
   */
  partition(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const arr = [new Collection(), new Collection()];
    for (const [key, val] of this) {
      if (fn(val, key, this)) arr[0].set(key, val);
      else arr[1].set(key, val);
    }
    return arr;
  }

  /**
   * @param {Function} fn
   * @param {*} [thisArg]
   * @returns {Array<*>}
   * @example collection.map(user => user.discriminator = '0001');
   */
  map(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const arr = [];
    for (const [key, val] of this) {
      arr.push(fn(val, key, this));
    }
    return arr;
  }

  /**
   * @param {Function} fn
   * @param {*} [thisArg]
   * @returns {Collection}
   * @example collection.mapCol(user => user.discriminator = '0001');
   */
  mapCol(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const col = new Collection();
    for (const [key, val] of this) {
      col.set(key, fn(val, key, this));
    }
    return col;
  }

  /**
   * @param {Function} fn
   * @param {*} [thisArg]
   * @returns {Boolean}
   * @example collection.some(user => user.discriminator === '0001');
   */
  some(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return true;
    }
    return false;
  }

  /**
   * @param {Function} fn
   * @param {*} [thisArg]
   * @returns {Boolean}
   * @example collection.every(user => user.discriminator === '0001');
   */
  every(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false;
    }
    return true;
  }

  /**
   * @param {Function} fn
   * @param {*} [accumulator] Starting value
   * @returns {*}
   * @example collection.reduce((guildA, guildB) => guildA.channels.size + guildB.channels.size);
   */
  reduce(fn, accumulator) {
    if (accumulator !== undefined && typeof accumulator !== 'number') {
      const text = `Second argument must be a number. Instead got ${typeof accumulator}.`;
      throw new TypeError(text);
    }
    for (const [key, val] of this) {
      if (!accumulator) accumulator = val;
      else accumulator = fn(accumulator, val, key, this);
    }
    return accumulator;
  }

  /**
   * @param {Function} fn
   * @param {*} [thisArg]
   * @returns {Collection}
   * @example collection.tap(guild => console.log(guild.channels.size));
   */
  tap(fn, thisArg) {
    this.forEach(fn, thisArg);
    return this;
  }

  /**
   * @returns {Collection}
   */
  clone() {
    return new this.constructor(this);
  }

  /**
   * @param {...Collection} collections
   * @returns {Collection}
   * @example collection.concat(col1, col2, col3);
   */
  concat(...collections) {
    const col = new this.constructor(this);
    for (const collection of collections) {
      for (const [key, val] of collection) col.set(key, val);
    }
    return col;
  }

  /**
   * @returns {Array<*>}
   */
  deleteAll() {
    const deleted = [];
    for (const [key, val] of this) {
      deleted.push(val);
      this.delete(key);
    }
    return deleted;
  }

  /**
   * @param {...Collection} collections
   * @returns {Boolean}
   * @example collection.equals(col1, col2, col3);
   */
  equals(...collections) {
    for (const collection of collections) {
      if (!collection) return false;
      if (this === collection) return true;
      if (this.size !== collection.size) return false;
      return !this.find((value, key) => {
        const testVal = collection.get(key);
        return (
          testVal !== value || (testVal === undefined && !collection.has(key))
        );
      });
    }
  }

  /**
   * @param {Function} fn
   * @returns {Collection} Sorted collection
   * @example collection.sort((guildA, guildB) => guildA.channels.size - guildB.channels.size);
   */
  sort(fn = (x, y) => +(x > y) || +(x === y) - 1) {
    const entries = [...this.entries()].sort((a, b) =>
      fn(a[1], b[1], a[0], b[0])
    );
    const col = new this.constructor(entries);
    return col;
  }
};

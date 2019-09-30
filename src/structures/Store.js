const path = require('path');
const fs = require('fs');
const Collection = require('../util/Collection');

function getFiles(filename, maindir, thisdir) {
  const files = [];
  const dir = path.dirname(filename);
  const base = path.basename(filename);
  if (!maindir) maindir = filename;
  let file = {
    path: filename,
    name: base,
    folder: path.basename(dir),
    dir,
  };
  if (thisdir && dir !== maindir) {
    file = {
      path: filename,
      name: base,
      folder: thisdir,
      dir,
    };
  }
  if (file.folder === path.basename(maindir)) file.folder = null;
  if (fs.statSync(filename).isDirectory()) {
    const data = fs.readdirSync(filename);
    data.forEach(e =>
      files.push(...getFiles(path.join(filename, e), maindir, file))
    );
  } else {
    files.push(file);
  }
  return files;
}

/**
 * @extends {Collection}
 */
module.exports = class Store extends Collection {
  constructor(client, type, defaults = null, _private = false) {
    super();

    this.client = client;
    this.type = type;
    this.folderName = this.client._private[`${this.type}sFolder`];
    this.filePath = this.client._private.fullpath;

    if (defaults) {
      this.init(defaults, path.basename(defaults));
    }
    this.init(this.filePath, this.folderName, _private);
  }

  /**
   * @param {*} key
   * @returns {*|null}
   */
  get(key) {
    let data = this.find(e => e.id === key);
    if (!data) data = this.find(e => e.key === key);
    if (!data && this.type === 'command') {
      data = this.find(e => e.aliases.includes(key));
    }
    if (!data) data = null;
    return data;
  }

  /**
   * @param {String} filepath Path to the file you want to load.
   * @returns {Store} this
   */
  load(filepath) {
    if (typeof filepath !== 'string') {
      const err = 'Filepath argument must be a string.';
      throw new TypeError(err);
    }
    filepath = path.join(this.client._private.dirpath, filepath);
    this.init(null, null, filepath);
  }

  /**
   * @param {String} filepath
   * @param {String} foldername
   * @returns {Store}
   */
  init(filepath, foldername, onlyfile = null, _private = false) {
    try {
      if (typeof onlyfile === 'string') {
        filepath = path.dirname(onlyfile);
        foldername = path.basename(filepath);
      }
      const dirPath = path.dirname(filepath);
      let files = fs.readdirSync(dirPath);
      let dir = files.find(e => e === foldername);
      if (!dir) {
        this.client[`${this.type}s`] = this;
        return this;
      }
      dir = path.join(dirPath, dir);
      if (!fs.existsSync(dir)) {
        this.client[`${this.type}s`] = this;
        return this;
      }
      const stat = fs.statSync(dir);
      if (!stat.isDirectory()) {
        this.client[`${this.type}s`] = this;
        return this;
      }
      files = getFiles(dir);
      if (typeof onlyfile === 'string') {
        files = [files.find(e => e.path === onlyfile)];
      }
      files.forEach(file => {
        const parents = [];
        let temp = file;
        while (temp.folder) {
          parents.push(temp.folder.name);
          temp = temp.folder;
        }
        if (require.cache[require.resolve(file.path)]) {
          delete require.cache[require.resolve(file.path)];
        }
        const Prop = require(file.path);
        if (typeof Prop !== 'function') {
          const parentName = path
            .basename(file.path)
            .split('.')
            .slice(0, -1)
            .join('.');
          parents.unshift(parentName);
          for (const key in Prop) {
            if ({}.hasOwnProperty.call(Prop, key)) {
              const prop = new Prop[key](this.client, this, file.path);
              prop._private = { parents };
              prop.categories = parents.reverse();
              this.set(prop.id, prop);
            }
          }
        } else {
          const prop = new Prop(this.client, this, file.path);
          prop._private = { parents };
          prop.categories = parents.reverse();
          this.set(prop.id, prop);
        }
      });
      this.client[`${this.type}s`] = this;
      return this;
    } catch (err) {
      this.client.emit('error', err);
    }
  }
};

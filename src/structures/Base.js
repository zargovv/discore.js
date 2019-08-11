const path = require('path');

const defaultOptions = {
  enabled: true,
  key: null,
  name: null,
};

module.exports = class Base {
  constructor(client, type, fullpath, options = {}) {
    options = { ...defaultOptions, ...options };
    this.client = client;
    this.id = this.client.uniqid.gen();
    this.dir = path.dirname(fullpath);
    this.file = path.basename(fullpath);
    this.type = type;
    this.enabled = options.enabled;
    this.key =
      options.key ||
      options.name ||
      this.file
        .split('.')
        .slice(0, -1)
        .join('.');
    this.name = this.key;
  }

  toggle() {
    if (this.enabled) this.enabled = false;
    if (!this.enabled) this.enabled = true;
    this.client.emit(`${this.type}Toggled`, this);
    return this;
  }

  unload() {
    this.client.emit('error', 'Soon!');
    return this;
  }

  reload() {
    this.client.emit('error', 'Soon!');
    return this;
  }

  disable() {
    const isEnabled = this.enabled;
    this.enabled = false;
    if (isEnabled) this.client.emit(`${this.type}Disabled`, this);
    return this;
  }

  enable() {
    const isEnabled = this.enabled;
    this.enabled = true;
    if (!isEnabled) this.client.emit(`${this.type}Enabled`, this);
    return this;
  }

  toString() {
    return this.key;
  }

  _init() {
    return this.init();
  }

  init() {}
};

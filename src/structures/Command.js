const Base = require('./Base');
const Collection = require('../util/Collection');

const defaultOptions = {
  cooldown: 0,
  aliases: [],
  permLevel: 0,
};

/**
 * @extends {Base}
 */
module.exports = class Command extends Base {
  constructor(client, store, fullpath, options = {}) {
    super(client, store, 'command', fullpath, options);
    /**
     * @name Command#_options
     * @type {Object}
     * @private
     */
    this._options = { ...defaultOptions, ...this._options };
    if (typeof this._options.aliases === 'string') {
      this._options.aliases = [this._options.aliases];
    }
    if (
      typeof this._options.aliases !== 'object' ||
      {}.hasOwnProperty.call(this._options.aliases, 'some')
    ) {
      const err = 'Aliases property must be an array or string.';
      this.client.emit('error', err);
    }
    if (this._options.aliases.some(e => typeof e !== 'string')) {
      const err = 'Aliases must be a string.';
      this.client.emit('error', err);
    }
    this.cooldown = this._options.cooldown;
    this.aliases = this._options.aliases;
    this.permLevel = this._options.permLevel;
    this.cooldowns = new Collection();
  }

  noPermsRun() {}

  cdRun() {}

  resetCooldowns(...ids) {
    if (ids.length > 0) ids.forEach(id => this.cooldowns.delete(id));
    else this.cooldowns.clear();
    return this.cooldowns;
  }
};

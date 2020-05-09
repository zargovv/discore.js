const Base = require('./Base');
const Collection = require('../util/Collection');
const Constants = require('../util/Constants');

const defaultOptions = {
  cooldown: 0,
  aliases: [],
  permLevel: 0,
  runIn: Constants.ChannelTypes,
  requiredPerms: [],
  requiredRoles: [],
};

/**
 * @extends {Base}
 */
module.exports = class Command extends Base {
  constructor(client, store, fullpath, options = {}) {
    super(client, store, 'command', fullpath, options);

    options = { ...defaultOptions, ...this._options };
    if (options.runIn === '*') options.runIn = defaultOptions.runIn;
    if (typeof options.runIn === 'string') options.runIn = [options.runIn];
    if (typeof options.requiredPerms === 'string') {
      options.requiredPerms = [options.requiredPerms];
    }
    if (typeof options.requiredRoles === 'string') {
      options.requiredRoles = [options.requiredRoles];
    }
    if (typeof options.aliases === 'string') {
      options.aliases = [options.aliases];
    }

    if (!(options.runIn instanceof Array)) {
      throw new TypeError('RunIn option must be an array or string');
    }
    if (options.runIn.some((t) => typeof t !== 'string')) {
      throw new TypeError('RunIn option must be an array of string type');
    }
    if (options.runIn.some((t) => Constants.ChannelTypes.indexOf(t) < 0)) {
      throw new TypeError('RunIn option includes an unknown channel type');
    }

    if (!(options.requiredPerms instanceof Array)) {
      throw new TypeError(
        'RequiredPerms option must be an array or string or number'
      );
    }
    if (
      options.requiredPerms.some(
        (t) => ['string', 'number'].indexOf(typeof t) < 0
      )
    ) {
      throw new TypeError(
        'RequiredPerms option must be an array of string or number type'
      );
    }

    const permKeys = Object.keys(Constants.Permissions);
    const permVals = Object.values(Constants.Permissions);
    if (
      options.requiredPerms.some(
        (p) => permKeys.indexOf(p) < 0 && permVals.indexOf(p) < 0
      )
    ) {
      throw new TypeError(
        'RequiredPerms option includes an unknown permission'
      );
    }

    if (!(options.aliases instanceof Array)) {
      throw new TypeError('Aliases option must be an array or string');
    }
    if (options.aliases.some((a) => typeof a !== 'string')) {
      throw new TypeError('Aliases option must be an array of string type');
    }

    /**
     * @name Command#_options
     * @type {Object}
     * @private
     */
    this._options = options;

    this.runIn = options.runIn;
    this.requiredRoles = options.requiredRoles;
    this.requiredPerms = options.requiredPerms;
    this.cooldown = options.cooldown;
    this.aliases = options.aliases;
    this.permLevel = options.permLevel;
    this.cooldowns = new Collection();
  }

  noPermsRun() {}

  noRequiredPermsRun() {}

  noRequiredRolesRun() {}

  cdRun() {}

  resetCooldowns(...ids) {
    if (ids.length > 0) ids.forEach((id) => this.cooldowns.delete(id));
    else this.cooldowns.clear();
    return this.cooldowns;
  }

  /**
   * @param {...any} ...args
   * @async
   * @private
   */
  async _run(...args) {
    let res;
    if (this.enabled) res = this.run(...args);
    else res = this.disabledRun(...args);
    if (this.once) this.unload();
    return await res;
  }
};

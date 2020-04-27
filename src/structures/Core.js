const { Client } = require('discord.js');
const path = require('path');
const Json = require('./Json');
const Store = require('./Store');
const Mongo = require('./Mongo');
const MySql = require('./MySql');
const Config = require('./Config');
const Collection = require('../util/Collection');
const PermissionLevels = require('./PermissionLevels');

const defaultOptions = {
  mainPath: '.',
  mobile: false,
  prefix: undefined,
  token: null,
  db: null,
};

const folderDefaults = {
  inhibitors: 'inhibitors',
  commands: 'commands',
  monitors: 'monitors',
  triggers: 'triggers',
  events: 'events',
};

const prefixDefaults = {
  spaceSeparator: false,
  ignoreCase: false,
  mention: false,
};

const commandDefaults = {
  argsSeparator: ' ',
  permLevels: new PermissionLevels(),
  ignoreCase: false,
  ignoreBots: true,
  ignoreSelf: true,
};

/**
 * @extends {DiscordClient}
 */
module.exports = class extends Client {
  constructor(options = {}) {
    options = {
      ...defaultOptions,
      ...options,
      folders: { ...(options.folders || {}), ...folderDefaults },
      prefixOptions: { ...(options.prefixOptions || {}), ...prefixDefaults },
      commandOptions: { ...(options.commandOptions || {}), ...commandDefaults },
    };
    const thisOptions = {
      inhibitorsFolder: options.folders.inhibitors,
      commandsFolder: options.folders.commands,
      triggersFolder: options.folders.triggers,
      monitorsFolder: options.folders.monitors,
      eventsFolder: options.folders.events,

      ignorePrefixCase: options.prefixOptions.ignoreCase,
      spaceSeparator: options.prefixOptions.spaceSeparator,
      mentionPrefix: options.prefixOptions.mention,

      argsSeparator: options.commandOptions.argsSeparator,
      ignoreCase: options.commandOptions.ignoreCase,
      permLevels: options.commandOptions.permLevels,
      ignoreBots: options.commandOptions.ignoreBots,
      ignoreSelf: options.commandOptions.ignoreSelf,

      mainPath: path.join(module.parent.parent.filename, options.mainPath),
      mobile: options.mobile,
      prefix: options.prefix,
      token: options.token,
      db: options.db,
    };
    delete options.folders;
    delete options.prefixOptions;
    delete options.commandOptions;
    delete options.mainPath;
    delete options.mobile;
    delete options.prefix;
    delete options.token;
    delete options.db;
    super({
      ...options,
      ...(thisOptions.mobile
        ? {
            ws: {
              properties: { $browser: 'Discord iOS', $device: 'Discord iOS' },
            },
          }
        : {}),
    });
    const { prefix, argsSeparator, db } = thisOptions;
    if (
      db !== undefined &&
      db !== null &&
      (typeof db !== 'object' ||
        (!(db instanceof Mongo) &&
          !(db instanceof MySql) &&
          !(db instanceof Json)))
    ) {
      throw new Error('Db property must be instance of Mongo, MySql or Json.');
    }
    if (prefix === undefined) thisOptions.prefix = '';
    if (
      typeof prefix === 'object' &&
      !(prefix instanceof RegExp) &&
      !(prefix instanceof Array)
    ) {
      throw new TypeError(
        'Prefix option must be a string or regular expression or array.'
      );
    }
    if (
      argsSeparator !== undefined &&
      argsSeparator !== null &&
      typeof argsSeparator !== 'string' &&
      !(argsSeparator instanceof RegExp)
    ) {
      throw new TypeError(
        'SplitArgs option must be a string, undefined, null or regular expression.'
      );
    }
    this.public = {};
    /**
     * @name Core#_private
     * @type {Object}
     * @private
     */
    this._private = { folders: {} };
    this._private.folders.inhibitors = thisOptions.inhibitorsFolder;
    this._private.folders.commands = thisOptions.commandsFolder;
    this._private.folders.monitors = thisOptions.monitorsFolder;
    this._private.folders.triggers = thisOptions.triggersFolder;
    this._private.folders.events = thisOptions.eventsFolder;
    this._private.sentPages = new Collection();
    this._private.fullpath = thisOptions.mainPath;
    this._private.dirpath = path.dirname(this._private.fullpath);
    this.config = {};
    this.config.guild = new Config(this, thisOptions);
    this.prefix = thisOptions.prefix;
    this.argsSeparator = thisOptions.argsSeparator;
    this.ignoreCase = thisOptions.ignoreCase;
    this.permLevels = thisOptions.permLevels;
    this.ignoreBots = thisOptions.ignoreBots;
    this.ignoreSelf = thisOptions.ignoreSelf;
    this.ignorePrefixCase = thisOptions.ignorePrefixCase;
    this.db = thisOptions.db;
    if (this.db) {
      if (this.db instanceof Mongo && this.db.connection) {
        this.db.connection.on('connected', () =>
          this.emit('dbConnect', this.db)
        );
        this.db.connection.on('err', (err) => this.emit('dbError', err));
        this.db.connection.on('disconnected', () =>
          this.emit('dbDisconnect', this.db)
        );
      } else if (this.db instanceof MySql) {
        this.db.on('connect', () => this.emit('dbConnect', this.db));
        this.db.on('error', (err) => this.emit('dbError', err));
        this.db.on('disconnect', () => this.emit('dbDisconnect', this.db));
      }
    }
    new Store(this, 'event', path.join(__dirname, '../events'));
    new Store(this, 'monitor', path.join(__dirname, '../monitors'));
    new Store(this, 'command');
    new Store(this, 'trigger');
    new Store(this, 'inhibitor');
    if (thisOptions.token) this.login(thisOptions.token);
  }
};

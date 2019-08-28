const { Client } = require('discord.js');
const path = require('path');
const Store = require('./Store');
const PermissionLevels = require('./PermissionLevels');
const Collection = require('../util/Collection');
const Mongo = require('./Mongo');
const MySql = require('./MySql');
const UniqueId = require('../util/UniqueId');
const Config = require('./Config');

const defaultOptions = {
  eventsFolder: 'events',
  commandsFolder: 'commands',
  monitorsFolder: 'monitors',
  triggersFolder: 'triggers',
  inhibitorsFolder: 'triggers',
  token: null,
  prefix: undefined,
  spaceAfterPrefix: false,
  splitArgs: ' ',
  ignoreCase: true,
  permLevels: new PermissionLevels(),
  ignoreBots: true,
  ignoreSelf: true,
  db: null,
};

/**
 * @extends {DiscordClient}
 */
module.exports = class extends Client {
  constructor(options = {}) {
    options = { ...defaultOptions, ...options };
    const thisOptions = {
      eventsFolder: options.eventsFolder,
      commandsFolder: options.commandsFolder,
      monitorsFolder: options.monitorsFolder,
      triggersFolder: options.triggersFolder,
      inhibitorsFolder: options.inhibitorsFolder,
      token: options.token,
      prefix: options.prefix,
      spaceAfterPrefix: options.spaceAfterPrefix,
      splitArgs: options.splitArgs,
      ignoreCase: options.ignoreCase,
      permLevels: options.permLevels,
      ignoreBots: options.ignoreBots,
      ignoreSelf: options.ignoreSelf,
      db: options.db,
    };
    delete options.eventsFolder;
    delete options.commandsFolder;
    delete options.monitorsFolder;
    delete options.triggersFolder;
    delete options.inhibitorsFolder;
    delete options.token;
    delete options.prefix;
    delete options.spaceAfterPrefix;
    delete options.splitArgs;
    delete options.ignoreCase;
    delete options.permLevels;
    delete options.ignoreBots;
    delete options.ignoreSelf;
    delete options.db;
    super(options);
    const { prefix, splitArgs, db } = thisOptions;
    if (
      db !== undefined &&
      db !== null &&
      (typeof db !== 'object' ||
        (!(db instanceof Mongo) && !(db instanceof MySql)))
    ) {
      throw new Error('Db property must be instance of Mongo or MySql.');
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
      splitArgs !== undefined &&
      splitArgs !== null &&
      splitArgs !== 'string' &&
      splitArgs !== 'object' &&
      typeof splitArgs === 'object' &&
      typeof splitArgs.test !== 'function'
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
    this._private = {};
    this._private.sentPages = new Collection();
    this._private.eventsFolder = thisOptions.eventsFolder;
    this._private.commandsFolder = thisOptions.commandsFolder;
    this._private.monitorsFolder = thisOptions.monitorsFolder;
    this._private.triggersFolder = thisOptions.triggersFolder;
    this._private.inhibitorsFolder = thisOptions.inhibitorsFolder;
    this._private.fullpath = require.main.filename;
    this._private.filepath = path.basename(require.main.filename);
    this._private.dirpath = path.dirname(require.main.filename);
    this.config = {};
    this.config.guild = new Config(this, thisOptions);
    this.prefix = thisOptions.prefix;
    this.splitArgs = thisOptions.splitArgs;
    this.ignoreCase = thisOptions.ignoreCase;
    this.permLevels = thisOptions.permLevels;
    this.ignoreBots = thisOptions.ignoreBots;
    this.ignoreSelf = thisOptions.ignoreSelf;
    this.db = thisOptions.db;
    this.uniqid = new UniqueId();

    if (this.db) {
      if (this.db instanceof Mongo && this.db.connection) {
        this.db.connection.on('connected', () =>
          this.emit('dbConnected', this.db)
        );
        this.db.connection.on('err', err => this.emit('dbError', err));
        this.db.connection.on('disconnected', () =>
          this.emit('dbDisconnected', this.db)
        );
      } else if (this.db instanceof MySql) {
        this.db.emitter.on('connected', () =>
          this.emit('dbConnected', this.db)
        );
        this.db.emitter.on('error', err => this.emit('dbError', err));
        this.db.emitter.on('disconnected', () =>
          this.emit('dbDisconnected', this.db)
        );
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

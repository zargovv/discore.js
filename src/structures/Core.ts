import { Client as Base, ClientOptions as BaseOptions } from 'discord.js';
// import * as Path from 'path';

import { Messages, TypeError } from '../util/errors';
import { deepMerge, isObject, isPrefix } from '../util/util';
import { Defaults, MOBILE_DEVICE } from '../util/Constants';

// const Json = require('./Json');
// const Store = require('./Store');
// const Mongo = require('./Mongo');
// const MySql = require('./MySql');
// const Config = require('./Config');
// const Collection = require('../util/Collection');
// const PermissionLevels = require('./PermissionLevels');

export type Prefix = string | RegExp;
export type PrefixValue = Prefix | Prefix[];

export interface CoreFolders {
  commands?: string;
  events?: string;
  inhibitors?: string;
  triggers?: string;
}

export interface CorePrefixOptions {
  ignoreCase?: boolean;
  mention?: boolean;
  spaceSeparator?: boolean;
  value?: PrefixValue;
}

export interface CoreCommandOptions {
  argsSeparator?: string;
  ignoreBots?: boolean;
  ignoreCase?: boolean;
  ignoreSelf?: boolean;
  permLevels?: any; // Temporary
}

interface ICoreOptions {
  command?: CoreCommandOptions;
  db?: any; // Temporary
  dir?: string;
  folders?: CoreFolders;
  mobile?: boolean;
  prefix?: PrefixValue | CorePrefixOptions;
  token?: string;
}
export type CoreOptions = ICoreOptions & BaseOptions;

/**
 * Main interface
 */
export class Core extends Base {
  /**
   * @param {CoreOptions} [options={}] Options
   *
   * @example
   * ```ts
   * new Core({ token: 'BOT_TOKEN' });
   * ```
   */
  constructor(options: CoreOptions = {}) {
    Core.validateOptions(options);
    Core.normalizeOptions(options);
    Core.mergeDefaults(options);

    const baseOptionKeys: (keyof BaseOptions)[] = [
      'allowedMentions',
      'disableMentions',
      'fetchAllMembers',
      'http',
      'messageCacheLifetime',
      'messageCacheMaxSize',
      'messageEditHistoryMaxSize',
      'messageSweepInterval',
      'partials',
      'presence',
      'restRequestTimeout',
      'restSweepInterval',
      'restTimeOffset',
      'restWsBridgeTimeout',
      'retryLimit',
      'shardCount',
      'shards',
      'ws'
    ];

    const baseOptions: BaseOptions = {};
    for (const key of baseOptionKeys) {
      if (key in options) baseOptions[key] = options[key] as undefined;
    }

    if (options.mobile) {
      const wsOptions: { [K: string]: any } = baseOptions.ws || {};
      const wsProperties = wsOptions.properties || {};
      wsProperties.$browser = MOBILE_DEVICE;
      wsProperties.$device = MOBILE_DEVICE;
      wsOptions.properties = wsProperties;
      baseOptions.ws = JSON.parse(JSON.stringify(wsOptions));
    }

    super(baseOptions);
  }

  /**
   * Formats the options into a single structure
   *
   * @param {ICoreOptions} options The options to format. Also used as returning value
   *
   * @returns {ICoreOptions} Formatted options
   *
   * @example
   * ```ts
   * Core.normalizeOptions({ prefix: '!' });
   * ```
   */
  static normalizeOptions(options: ICoreOptions) {
    if ('prefix' in options) {
      if (!isObject(options.prefix)) {
        options.prefix = { value: options.prefix as PrefixValue };
      }

      const prefixOptions = options.prefix as CorePrefixOptions;
      if ('value' in prefixOptions && !Array.isArray(prefixOptions.value)) {
        prefixOptions.value = [prefixOptions.value as Prefix];
      }
    }
    return options;
  }

  /**
   * Merges default core options into the provided options
   *
   * @param {ICoreOptions} options The options to merge the default options to. Also used as returning value
   *
   * @returns {ICoreOptions} Options, merged with default core options.
   *
   * @example
   * ```ts
   * Core.mergeDefaults({ prefix: { value: '!' } });
   * ```
   */
  static mergeDefaults(options: ICoreOptions) {
    const newOptions = deepMerge(Defaults.CORE_OPTIONS, options);
    return Object.assign(options, newOptions);
  }

  /**
   * Validates the provided options
   *
   * @param {ICoreOptions} options The options to validate
   *
   * @returns {boolean} The result of validation
   *
   * @example
   * ```ts
   * const myOptions = {}; // Any Core options to validate
   * Core.validateOptions(myOptions);
   * ```
   */
  static validateOptions(options: ICoreOptions) {
    if ('command' in options && typeof options.command !== 'object') {
      throw new TypeError(
        Messages.INVALID_OPTION('command', 'object', options.command)
      );
    }

    // Temporary
    if ('db' in options && !options.db) {
      throw new TypeError(Messages.INVALID_OPTION('db', 'DB', options.db));

      // Add dependency checks
      // throw new Error(Messages.DB_MISSING_DEPENDENCY(''));
    }

    if ('dir' in options && typeof options.dir !== 'string') {
      throw new TypeError(
        Messages.INVALID_OPTION('dir', 'string', options.dir)
      );
    }

    if ('folders' in options && typeof options.folders !== 'object') {
      throw new TypeError(
        Messages.INVALID_OPTION('folders', 'object', options.folders)
      );
    }

    if ('mobile' in options && typeof options.mobile !== 'object') {
      throw new TypeError(
        Messages.INVALID_OPTION('mobile', 'boolean', options.mobile)
      );
    }

    if ('prefix' in options) {
      if (!['string', 'object'].includes(typeof options.prefix)) {
        throw new TypeError(
          Messages.INVALID_OPTION(
            'prefix',
            'either PrefixValue or PrefixOptions',
            options.prefix
          )
        );
      }

      const isPrefixValue =
        Array.isArray(options.prefix) || isPrefix(options.prefix);

      const prefixValue = isPrefixValue
        ? options.prefix
        : (options.prefix as CorePrefixOptions).value;

      if (prefixValue !== undefined) {
        if (Array.isArray(prefixValue)) {
          for (const [i, prefix] of Object.entries(prefixValue)) {
            if (!isPrefix(prefix)) {
              throw new TypeError(
                Messages.INVALID_OPTION(
                  `prefix[${i}]`,
                  'either string or RegExp',
                  prefix
                )
              );
            }
          }
        } else if (!isPrefix(prefixValue)) {
          throw new TypeError(
            Messages.INVALID_OPTION(
              'prefix',
              'either string, RegExp or Array',
              prefixValue
            )
          );
        }
      }

      if (!isPrefixValue) {
        const prefixOptions = options.prefix as CorePrefixOptions;

        if (
          'ignoreCase' in prefixOptions &&
          typeof prefixOptions.ignoreCase !== 'boolean'
        ) {
          throw new TypeError(
            Messages.INVALID_OPTION(
              'prefix.ignoreCase',
              'boolean',
              prefixOptions.ignoreCase
            )
          );
        }

        if (
          'mention' in prefixOptions &&
          typeof prefixOptions.mention !== 'boolean'
        ) {
          throw new TypeError(
            Messages.INVALID_OPTION(
              'prefix.mention',
              'boolean',
              prefixOptions.mention
            )
          );
        }

        if (
          'spaceSeparator' in prefixOptions &&
          typeof prefixOptions.spaceSeparator !== 'boolean'
        ) {
          throw new TypeError(
            Messages.INVALID_OPTION(
              'prefix.spaceSeparator',
              'boolean',
              prefixOptions.spaceSeparator
            )
          );
        }
      }
    }

    if ('token' in options && typeof options.token !== 'string') {
      throw new TypeError(
        Messages.INVALID_OPTION('token', 'string', options.token)
      );
    }

    return true;
  }
}

// module.exports = class extends Client {
//   constructor(options = {}) {
//     super();
//     const thisOptions = {
//       mainPath: options.mainPath.startsWith('/')
//         ? options.mainPath
//         : path.join(
//             path.dirname(module.parent.parent.filename),
//             options.mainPath,
//             path.basename(module.parent.parent.filename)
//           )
//     };
//     this.public = {};
//     /**
//      * @name Core#_private
//      * @type {Object}
//      * @private
//      */
//     this._private = { folders: {} };
//     this._private.folders.inhibitors = thisOptions.inhibitorsFolder;
//     this._private.folders.finalizers = thisOptions.finalizersFolder;
//     this._private.folders.commands = thisOptions.commandsFolder;
//     this._private.folders.monitors = thisOptions.monitorsFolder;
//     this._private.folders.triggers = thisOptions.triggersFolder;
//     this._private.folders.events = thisOptions.eventsFolder;
//     this._private.sentPages = new Collection();
//     this._private.fullpath = thisOptions.mainPath;
//     this._private.dirpath = path.dirname(this._private.fullpath);
//     this.config = {};
//     this.config.guild = new Config(this, thisOptions);
//     this.prefix = thisOptions.prefix;
//     this.argsSeparator = thisOptions.argsSeparator;
//     this.ignoreCase = thisOptions.ignoreCase;
//     this.permLevels = thisOptions.permLevels;
//     this.ignoreBots = thisOptions.ignoreBots;
//     this.ignoreSelf = thisOptions.ignoreSelf;
//     this.ignorePrefixCase = thisOptions.ignorePrefixCase;
//     this.db = thisOptions.db;
//     if (this.db) {
//       if (this.db instanceof Mongo && this.db.connection) {
//         this.db.connection.on('connected', () =>
//           this.emit('dbConnect', this.db)
//         );
//         this.db.connection.on('err', err => this.emit('dbError', err));
//         this.db.connection.on('disconnected', () =>
//           this.emit('dbDisconnect', this.db)
//         );
//       } else if (this.db instanceof MySql) {
//         this.db.on('connect', () => this.emit('dbConnect', this.db));
//         this.db.on('error', err => this.emit('dbError', err));
//         this.db.on('disconnect', () => this.emit('dbDisconnect', this.db));
//       }
//     }
//     new Store(this, 'event', path.join(__dirname, '../events'));
//     new Store(this, 'monitor', path.join(__dirname, '../monitors'));
//     new Store(this, 'command');
//     new Store(this, 'trigger');
//     new Store(this, 'finalizer');
//     new Store(this, 'inhibitor');
//     if (thisOptions.token) this.login(thisOptions.token);
//   }
// };

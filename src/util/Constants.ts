export const MOBILE_DEVICE = 'Discord iOS';

// export interface CoreFoldersOptions {
//   commands?: string;
//   events?: string;
//   inhibitors?: string;
//   triggers?: string;
// }

// export interface CorePrefixOptions {
//   ignoreCase?: boolean;
//   mention?: boolean;
//   spaceSeparator?: boolean;
//   value?: PrefixValue;
// }

/**
 * 
 */
export const Defaults = {
  /**
   * Default options for the Core interface
   * @typedef {Object} CoreOptions
   * @property {CoreCommandOptions} [command] Options for entire commands
   * @property {string} [dir='.'] Main directory for the bot instance, where command, event and etc. folders are located in
   * @property {CoreFolders} [folders] Folder names for bot components, such as commands, events and etc.
   * @property {boolean} [mobile=false] Displays the bot as online from mobile
   * @property {CorePrefixOptions} [prefix] 
   */
  CORE_OPTIONS: {
    command: {
      argsSeparator: ' ',
      ignoreBots: true,
      ignoreCase: true,
      ignoreSelf: true,
      permLevels: null // Temporary
    },
    dir: '.',
    folders: {
      commands: 'commands',
      events: 'events',
      inhibitors: 'inhibitors',
      triggers: 'triggers'
    },
    mobile: false,
    prefix: {
      ignoreCase: true,
      mention: false,
      spaceSeparator: false,
      value: ''
    }
  }
};

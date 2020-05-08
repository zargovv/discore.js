const Discord = require('discord.js');

module.exports = {
  Core: require('./structures/Core'),
  Store: require('./structures/Store'),
  Event: require('./structures/Event'),
  Command: require('./structures/Command'),
  Monitor: require('./structures/Monitor'),
  Trigger: require('./structures/Trigger'),
  Inhibitor: require('./structures/Inhibitor'),
  Finalizer: require('./structures/Finalizer'),
  Json: require('./structures/Json'),
  Mongo: require('./structures/Mongo'),
  MySql: require('./structures/MySql'),
  Pages: require('./structures/Pages'),
  UniqueId: require('./util/UniqueId'),
  PermissionLevels: require('./structures/PermissionLevels'),
  Constants: require('./util/Constants'),
  Collection: Discord.Collection,
  Embed: Discord.MessageEmbed,
  Discord,
};

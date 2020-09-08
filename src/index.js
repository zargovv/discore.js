const Discord = require('discord.js');

module.exports = {
  Core: require('./structures/Core'),
  Json: require('./structures/Json'),
  Store: require('./structures/Store'),
  Event: require('./structures/Event'),
  Mongo: require('./structures/Mongo'),
  MySql: require('./structures/MySql'),
  Pages: require('./structures/Pages'),
  Command: require('./structures/Command'),
  Monitor: require('./structures/Monitor'),
  Trigger: require('./structures/Trigger'),
  Document: require('./util/Document'),
  UniqueId: require('./util/UniqueId'),
  Inhibitor: require('./structures/Inhibitor'),
  Finalizer: require('./structures/Finalizer'),
  Constants: require('./util/Constants'),
  PermissionLevels: require('./structures/PermissionLevels'),
  Embed: Discord.MessageEmbed,
  Collection: Discord.Collection,
  Discord,
};

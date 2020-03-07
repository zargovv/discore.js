const Event = require('../structures/Event');

module.exports = class extends Event {
  get options() {
    return { key: 'message' };
  }

  async run(message) {
    if (!message) return;
    if (!message.channel) return;
    if (!message.author) return;
    const {
      ignoreCase,
      prefix,
      argsSeparator,
      ignoreBots,
      ignoreSelf,
      spaceSeparator,
      mentionPrefix,
      ignorePrefixCase,
    } = this.client.config.guild.get(message.guild ? message.guild.id : null);
    if (ignoreBots && message.author.bot) return;
    if (ignoreSelf && message.author.id === this.client.user.id) return;
    let { content } = message;
    let prefixes = prefix;
    let matched = null;
    if (!(prefixes instanceof Array)) prefixes = [prefixes];
    if (ignorePrefixCase) {
      content = content.toLowerCase();
      prefixes = prefixes.map(e =>
        typeof e === 'string' ? e.toLowerCase() : e
      );
    }
    for (const _prefix of prefixes) {
      if (matched) break;
      if (typeof _prefix === 'string' && content.startsWith(_prefix)) {
        matched = prefix;
      } else if (_prefix instanceof RegExp) {
        let __prefix = _prefix;
        if (!_prefix.source.startsWith('^')) {
          __prefix = new RegExp(`^${_prefix.source}`, _prefix.flags);
        }
        matched = content.match(__prefix);
        if (matched) matched = matched[0];
      }
    }
    if (!matched && mentionPrefix) {
      matched = `<@${this.client.user.id}> `;
      if (message.mentions.users.first()) {
        message.mentions.users.delete(
          message.mentions.users.keys().next().value
        );
      }
    }
    if (!matched) return this.client.triggers.forEach(e => e._run(message));
    if (typeof matched === 'string' && !content.startsWith(matched)) {
      this.client.triggers.forEach(e => e._run(message));
      return;
    }
    if (matched instanceof Array) matched = matched[0];
    let args = message.content.slice(matched.length);
    if (argsSeparator) args = args.split(argsSeparator);
    let cmd = args.shift();
    if (!cmd && spaceSeparator && args[0]) cmd = args.shift();
    if (ignoreCase) cmd = cmd.toLowerCase();
    const filter = e =>
      (ignoreCase ? e.key.toLowerCase() : e.key) === cmd ||
      (ignoreCase ? e.aliases.map(e => e.toLowerCase()) : e.aliases).includes(
        cmd
      );
    const command = this.client.commands.find(filter);
    if (!command) return this.client.triggers.forEach(e => e._run(message));
    const permTest = await this.client.permLevels.test(
      command.permLevel,
      message,
      this.client
    );
    if (!permTest) return command.noPermsRun(message, args);
    if (command.cooldowns.get(message.author.id) > Date.now()) {
      return command.cdRun(message, args);
    }
    let bool = true;
    for (const inhibitor of this.client.inhibitors.values()) {
      if (!bool) return;
      bool = Boolean(await inhibitor._run(message, command));
    }
    if (!bool) return;
    command.cooldowns.set(message.author.id, Date.now() + command.cooldown);
    command._run(message, args);
  }
};

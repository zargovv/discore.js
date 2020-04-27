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
      mentionPrefix,
      ignoreBots,
      ignoreSelf,
      argsSeparator,
      spaceSeparator,
      ignoreCase,
      prefix,
    } = this.client.config.guild.get(message.guild ? message.guild.id : null);
    if (ignoreBots && message.author.bot) return;
    if (ignoreSelf && message.author.id === this.client.user.id) return;
    let { content } = message;
    let prefixes = prefix;
    let matched = null;
    if (!(prefixes instanceof Array)) prefixes = [prefixes];
    if (ignoreCase) {
      content = content.toLowerCase();
      prefixes = prefixes.map((e) =>
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
    if (typeof matched !== 'string' && !matched && mentionPrefix) {
      matched = `<@${this.client.user.id}> `;
      if (message.mentions.users.first()) {
        message.mentions.users.delete(
          message.mentions.users.keys().next().value
        );
      }
    }
    if (typeof matched !== 'string' && !matched) {
      return this.client.triggers.forEach((e) => e._run(message));
    }
    if (typeof matched === 'string' && !content.startsWith(matched)) {
      this.client.triggers.forEach((e) => e._run(message));
      return;
    }
    if (matched instanceof Array) matched = matched[0];
    let args = message.content.substr(matched.length);
    if (spaceSeparator) args = args.trimLeft();
    args = args.split(argsSeparator || ' ');
    const cmd = this.client.commands
      .map((c) => {
        const name = `${ignoreCase ? c.key.toLowerCase() : c.key} `;
        const aliases = (
          (ignoreCase ? c.aliases.map((a) => a.toLowerCase()) : c.aliases) || []
        ).map((a) => `${a} `);
        const text = `${args.join(argsSeparator || ' ')} `;
        const commandName = text.startsWith(name)
          ? name
          : aliases.find((a) => text.startsWith(a));
        return { name: commandName, command: c };
      })
      .find((c) => !!c.name);
    if (!cmd) return this.client.triggers.forEach((e) => e._run(message));
    const { command } = cmd;
    args = args
      .join(argsSeparator || ' ')
      .substr(cmd.name.length)
      .split(argsSeparator || ' ');
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
      bool = Boolean(await inhibitor._run(message, command));
      if (!bool) return;
    }
    command.cooldowns.set(message.author.id, Date.now() + command.cooldown);
    command._run(message, args);
  }
};

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
    const { content } = message;

    const prefixes = prefix instanceof Array ? prefix : [prefix];

    const strPrefixes = prefixes.map((p) =>
      p instanceof RegExp ? p.source : p
    );

    const prefixRegex = new RegExp(
      `^((${strPrefixes.join('|')})${spaceSeparator ? '\\s?' : ''})${
        mentionPrefix ? `|(<@!?${this.client.user.id}>\\s)` : ''
      }`,
      ignoreCase ? 'i' : ''
    );

    const runTriggers = () =>
      this.client.triggers.forEach((e) => e._run(message));

    const prefixMatch = content.match(prefixRegex);
    if (!prefixMatch) return runTriggers();

    if (prefix[1]) {
      message.mentions.users.delete(this.client.user.id);
      (message.mentions.members || { delete() {} }).delete(this.client.user.id);
    }

    const cmdContent = content.substr(
      prefixMatch.index + prefixMatch[0].length
    );
    const cmd = this.client.commands
      .map((c) => {
        const aliases = c.aliases.length > 0 ? `|${c.aliases.join('|')}` : '';

        const regex = new RegExp(
          `^(${c.key}${aliases})(?:\\s|$)`,
          ignoreCase ? 'i' : ''
        );

        const match = cmdContent.match(regex);
        if (!match) return;

        return { name: match[1], command: c };
      })
      .filter(Boolean)[0];
    if (!cmd) return runTriggers();

    const argsContent = cmdContent.substr(cmd.name.length);

    const { command } = cmd;

    if (command.requiredPerms.length > 0) {
      if (!message.member) return runTriggers();
      if (
        command.requiredPerms.some((p) => !message.member.permissions.has(p))
      ) {
        return command.noRequiredPerms(message, args);
      }
    }

    if (command.requiredRoles.length > 0) {
      if (!message.member) return runTriggers();
      if (
        command.requiredRoles.some((p) => !message.member.roles.cache.has(p))
      ) {
        return runTriggers();
      }
    }

    if (command.runIn.indexOf(message.channel.type) < 0) return runTriggers();

    args = argsContent.split(argsSeparator || ' ');

    const permTest = await this.client.permLevels.test(
      command.permLevel,
      message,
      this.client
    );
    if (!permTest) return command.noPermsRun(message, args);
    if (command.cooldowns.get(message.author.id) > Date.now()) {
      return command.cdRun(message, args);
    }

    for (const inhibitor of this.client.inhibitors.values()) {
      if (!Boolean(await inhibitor._run(message, command))) {
        return runTriggers();
      }
    }

    command.cooldowns.set(message.author.id, Date.now() + command.cooldown);
    command
      ._run(message, args)
      .then((res) =>
        this.client.finalizers.forEach((f) => f(message, res, command.enabled))
      );
  }
};

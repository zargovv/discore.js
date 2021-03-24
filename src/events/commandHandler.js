const Event = require('../structures/Event');

function escape(source) {
  return source.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

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
      prefix
    } = this.client.config.guild.get(message.guild ? message.guild.id : null);
    if (ignoreBots && message.author.bot) return;
    if (ignoreSelf && message.author.id === this.client.user.id) return;
    const { content } = message;

    const prefixes = prefix instanceof Array ? prefix : [prefix];

    const strPrefixes = prefixes.map(p =>
      p instanceof RegExp ? p.source : escape(p)
    );

    const prefixRegex = new RegExp(
      `^((${strPrefixes.join('|')})${spaceSeparator ? '\\s?' : ''})${
        mentionPrefix ? `|(<@!?${this.client.user.id}>\\s)` : ''
      }`,
      ignoreCase ? 'i' : ''
    );

    const runTriggers = () =>
      this.client.triggers.forEach(e => e._run(message));

    const prefixMatch = content.match(prefixRegex);
    if (!prefixMatch) return runTriggers();

    if (prefix[1]) {
      message.mentions.users.delete(this.client.user.id);
      (message.mentions.members || { delete() {} }).delete(this.client.user.id);
    }

    const cmdContent = content.substr(
      prefixMatch.index + prefixMatch[0].length
    );

    const commands = [];
    this.client.commands.forEach(c => {
      commands.push({ name: c.name, command: c });
      c.aliases.forEach(a => commands.push({ name: a, command: c }));
    });

    const cmd = commands
      .sort((b, a) => a.name.length - b.name.length)
      .map(c => {
        const regex = new RegExp(
          `^(${escape(c.name)})(?:\\s|$)`,
          ignoreCase ? 'i' : ''
        );

        const match = cmdContent.match(regex);
        if (!match) return;

        return { name: match[0], command: c.command };
      })
      .filter(Boolean)[0];
    if (!cmd) return runTriggers();

    message.cmd = cmd.name;
    const argsContent = cmdContent.substr(cmd.name.length);

    const { command } = cmd;

    const args = argsContent ? argsContent.split(argsSeparator || ' ') : [];
    const params = {
      usedPrefix: prefixMatch[0],
      usedCommand: cmd.name
    };

    if (command.requiredPerms.length > 0) {
      if (!message.member) return runTriggers();
      if (!command.requiredPerms.some(p => message.member.permissions.has(p))) {
        return command.noRequiredPermsRun(message, args, params);
      }
    }

    if (command.requiredRoles.length > 0) {
      if (!message.member) return runTriggers();
      if (!command.requiredRoles.some(p => message.member.roles.cache.has(p))) {
        return command.noRequiredRolesRun(message, args, params);
      }
    }

    if (command.runIn.indexOf(message.channel.type) < 0) return runTriggers();

    const permTest = await this.client.permLevels.test(
      command.permLevel,
      message,
      this.client
    );
    if (!permTest) return command.noPermsRun(message, args, params);
    if (command.cooldowns.get(message.author.id) > Date.now()) {
      return command.cdRun(message, args, params);
    }

    const runInhibitors = () => {
      const inhibitors = [...this.client.inhibitors.values()];
      const promises = inhibitors.map(inhibitor => {
        return inhibitor._run(command, message, args, params);
      });
      return Promise.all(promises).then(res => !res.includes(false));
    };

    if (!(await runInhibitors())) return runTriggers();

    const runFinalizers = res =>
      this.client.finalizers.forEach(f =>
        f._run(message, res, command.enabled)
      );

    command.cooldowns.set(message.author.id, Date.now() + command.cooldown);
    command._run(message, args, params).then(res => runFinalizers(res));
  }
};

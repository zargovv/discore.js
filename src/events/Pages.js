const Event = require('../structures/Event');

const reactionControl = class extends Event {
  get options() {
    return {
      key: 'raw',
    };
  }

  async run(event) {
    if (!this.client) return;
    if (!event.t) return;
    if (
      !['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(event.t)
    ) {
      return;
    }
    if (!event.d) return;
    if (!event.d.message_id) return;
    if (!this.client._private.sentPages.has(event.d.message_id)) return;
    if (!event.d.channel_id) return;
    if (!event.d.emoji) return;
    if (!event.d.user_id) return;
    if (event.d.user_id === this.client.user.id) return;
    const user = this.client.users.get(event.d.user_id);
    if (!user) return;
    const emoji = event.d.emoji.id
      ? `${event.d.emoji.name}:${event.d.emoji.id}`
      : event.d.emoji.name;
    if (!emoji) return;
    const channel = this.client.channels.get(event.d.channel_id);
    if (!channel) return;
    const message = await channel
      .fetchMessage(event.d.message_id)
      .catch(() => {});
    if (!message) return;
    const reaction = message.reactions.get(emoji);
    if (!reaction) return;
    reaction.users.set(user.id, user);
    const pages = this.client._private.sentPages.get(message.id);
    if (pages.filter(reaction, user) !== true) return;
    let type;
    if (
      (reaction.emoji.id || event.d.emoji.name) === pages.pages.emojis.prevPage
    ) {
      type = 'prev';
    } else if (
      (reaction.emoji.id || event.d.emoji.name) === pages.pages.emojis.nextPage
    ) {
      type = 'next';
    }
    if (!type) return;
    if (type === 'prev' && pages.curPage < 1) return;
    if (type === 'next' && pages.curPage >= pages.pages.pages.length - 1) {
      return;
    }
    if (type === 'prev') pages.curPage -= 1;
    if (type === 'next') pages.curPage += 1;
    message
      .edit(pages.pages.pages[pages.curPage].msg)
      .then(() => this.client._private.sentPages.set(message.id, pages))
      .catch(e => this.client.emit('error', e));
  }
};

const deleteControl = class extends Event {
  get options() {
    return {
      key: 'messageDelete',
    };
  }

  async run(message) {
    if (!this.client) return;
    if (!message) return;
    if (!message.id) return;
    if (!this.client._private.sentPages.has(message.id)) return;
    this.client._private.sentPages.delete(message.id);
  }
};

module.exports = [reactionControl, deleteControl];

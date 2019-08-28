const defaultOptions = {
  filter: () => true,
  prevPage: '⏮',
  nextPage: '⏭',
};

module.exports = class Pages {
  constructor(client, options) {
    this.client = client;
    this.options = { ...defaultOptions, ...options };
    this.emojis = {
      prevPage: this.options.prevPage,
      nextPage: this.options.nextPage,
    };
    this.pages = [];
    this.filter = this.options.filter;
    if (typeof this.filter !== 'function') {
      throw new TypeError('Filter option must be a function.');
    }
    return this;
  }

  /**
   * @param {*} msg Message to send.
   * @returns {Pages}
   */
  addPage(msg) {
    this.pages.push({ msg, page: this.pages.length });
    return this;
  }

  /**
   * @param {...any} msgs Messages to send.
   * @returns {Pages}
   */
  add(...msgs) {
    msgs.forEach(e => this.addPage(e));
    return this;
  }

  /**
   * @param {*} channel The channel where to send those Pages.
   * @returns {*} Message that was sent.
   * @async
   */
  async send(channel) {
    if (typeof channel !== 'object') {
      throw new TypeError('Channel argument must be an object.');
    }
    if ({}.hasOwnProperty.call(channel, 'channel')) ({ channel } = channel);
    if (typeof channel.send !== 'function') {
      throw new Error('Channel argument must be channel.');
    }
    const page = this.pages[0];
    const sentMsg = await channel.send(page.msg);
    this.client._private.sentPages.set(sentMsg.id, {
      message: sentMsg,
      msgId: sentMsg.id,
      pages: this,
      curPage: page.page,
      emojis: this.emojis,
      filter: this.filter,
    });
    try {
      await sentMsg.react(this.emojis.prevPage).catch(() => {});
      sentMsg.react(this.emojis.nextPage).catch(() => {});
    } catch (e) {
      this.client.emit('error', e);
    }
    return sentMsg;
  }
};

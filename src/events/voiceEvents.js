const Event = require('../structures/Event');

module.exports = class extends Event {
  get options() {
    return { key: 'voiceStateUpdate' };
  }

  run(oldState, newState) {
    if (!oldState.channel && !newState.channel) return;
    let ev;
    if (!oldState.channel) ev = 'Join';
    if (
      oldState.channel &&
      newState.channel &&
      oldState.channelID !== newState.channelID
    ) {
      ev = 'Switch';
    }
    if (!newState.channel) ev = 'Leave';
    if (ev) this.client.emit(`voiceChannel${ev}`, oldState, newState);
  }
};

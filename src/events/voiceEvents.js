const Event = require('../structures/Event');

module.exports = class extends Event {
  get options() {
    return { key: 'voiceStateUpdate' };
  }

  run(oldMember, newMember) {
    if (!oldMember.voiceChannel && !newMember.voiceChannel) return;
    let ev;
    if (!oldMember.voiceChannel) ev = 'Join';
    if (
      oldMember.voiceChannel &&
      newMember.voiceChannel &&
      oldMember.voiceChannelID !== newMember.voiceChannelID
    ) {
      ev = 'Switch';
    }
    if (!newMember.voiceChannel) ev = 'Leave';
    if (ev) this.client.emit(`voiceChannel${ev}`, oldMember, newMember);
  }
};

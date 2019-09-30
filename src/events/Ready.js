const Event = require('../structures/Event');

module.exports = class extends Event {
  get options() {
    return { key: 'ready' };
  }

  run() {
    this.client.events.forEach(e => e._init());
    this.client.monitors.forEach(e => e._init());
    this.client.commands.forEach(e => e._init());
  }
};

const Event = require('../structures/Event');

module.exports = class extends Event {
  get options() {
    return { key: 'message' };
  }

  async run(message) {
    this.client.monitors.forEach(e => e._run(message));
  }
};

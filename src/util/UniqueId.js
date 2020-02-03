class UniqueId {
  constructor() {
    this.id = UniqueId.generate().toString('hex');
  }

  static randomBytes(size) {
    const result = new Uint8Array(size);
    for (let i = 0; i < size; ++i) result[i] = Math.floor(Math.random() * 256);
    return result;
  }

  static getInc() {
    return (UniqueId.index = (UniqueId.index + 1) % 0xffffff);
  }

  static generate(time) {
    if (typeof time !== 'number') time = ~~(Date.now() / 1000);
    const inc = UniqueId.getInc();
    const buffer = Buffer.alloc(12);
    buffer[3] = time & 0xff;
    buffer[2] = (time >> 8) & 0xff;
    buffer[1] = (time >> 16) & 0xff;
    buffer[0] = (time >> 24) & 0xff;
    const PROCESS_UNIQUE = this.randomBytes(5);
    buffer[4] = PROCESS_UNIQUE[0];
    buffer[5] = PROCESS_UNIQUE[1];
    buffer[6] = PROCESS_UNIQUE[2];
    buffer[7] = PROCESS_UNIQUE[3];
    buffer[8] = PROCESS_UNIQUE[4];
    buffer[11] = inc & 0xff;
    buffer[10] = (inc >> 8) & 0xff;
    buffer[9] = (inc >> 16) & 0xff;
    return buffer;
  }

  toString() {
    return this.id;
  }
}

UniqueId.index = ~~(Math.random() * 0xffffff);

module.exports = UniqueId;

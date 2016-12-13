class SequenceStorage {
  constructor() {
    this.reset();
  }

  next(name) {
    if (!this.sequences[name]) this.sequences[name] = 0;

    this.sequences[name] += 1;
    return this.sequences[name];
  }

  reset() {
    this.sequences = {};
  }
}

const sequenceStorage = new SequenceStorage();
module.exports = sequenceStorage;

class FactoryTrait {
  constructor(fn) {
    this.fieldFillers = {};
    this.collbackCollection = { before: {}, after: {} };
    fn(this);
  }

  field(name, filler) {
    this.fieldFillers[name] = filler;
  }

  before(actionName, callback) {
    this.collbackCollection.before[actionName] = callback;
  }

  after(actionName, callback) {
    this.collbackCollection.after[actionName] = callback;
  }

  getCallback(type, actionName) {
    return this.getCallbacks(type)[actionName];
  }

  getCallbacks(type) {
    return this.collbackCollection[type];
  }

  forEach(callback) {
    Object.keys(this.fieldFillers).forEach((name) => {
      callback(this.fieldFillers[name], name);
    });
  }
}

module.exports = FactoryTrait;

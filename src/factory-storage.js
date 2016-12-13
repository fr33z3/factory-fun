class FactoryStorage {
  constructor() {
    this.reset();
  }

  store(name, factory) {
    this.factories[name] = factory;
  }

  get(name) {
    return this.factories[name];
  }

  reset() {
    this.factories = {};
  }
}

const factoryStorage = new FactoryStorage();
module.exports = factoryStorage;

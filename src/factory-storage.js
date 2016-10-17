FactoryStorage = function() {
  this.reset();
}

FactoryStorage.prototype.store = function(name, factory) {
  this.factories[name] = factory;
}

FactoryStorage.prototype.get = function(name) {
  return this.factories[name]
}

FactoryStorage.prototype.reset = function(name) {
  this.factories = {}
}

var factoryStorage = new FactoryStorage();

module.exports = factoryStorage;

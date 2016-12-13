const extend = require('extend');
const factoryStorage = require('./src/factory-storage');
const sequence = require('./src/sequence');
const FactoryTrait = require('./src/factory-trait');
const parseArgs = require('./src/parse-args');

class Factory {
  constructor(modelClass) {
    this.ModelClass = modelClass;
    this.fieldFillers = {};
    this.traits = {};
    this.callbacks = { before: {}, after: {} };
  }

  field(name, filler) {
    this.fieldFillers[name] = filler;
  }

  trait(name, fn) {
    this.traits[name] = new FactoryTrait(fn);
  }

  build(traitNames, customFillers) {
    const instance = new this.ModelClass();
    const fieldFillers = this.getFieldFillers(traitNames, customFillers);

    this.applyCallbacks(instance, 'before', 'build', traitNames);
    Object.keys(fieldFillers).forEach((fieldName) => {
      const filler = fieldFillers[fieldName];
      this.applyFiller(instance, fieldName, filler);
    });
    this.applyCallbacks(instance, 'after', 'build', traitNames);

    return instance;
  }

  applyFiller(instance, fieldName, filler) {
    const instanceObject = instance;
    if (typeof filler === 'function') {
      instanceObject[fieldName] = filler(this.ModelClass, fieldName);
    } else {
      instanceObject[fieldName] = filler;
    }
  }

  getFieldFillers(traitNames, customerFillers) {
    const fillers = extend({}, this.fieldFillers, customerFillers);

    traitNames.forEach((name) => {
      const trait = this.traits[name];
      if (trait) extend(fillers, trait.fieldFillers);
    });

    return fillers;
  }

  before(actionName, callback) {
    this.callbacks.before[actionName] = callback;
  }

  after(actionName, callback) {
    this.callbacks.after[actionName] = callback;
  }

  getCallbacks(type, actionName, traitNames) {
    const callbacks = [];
    const callback = this.callbacks[type][actionName];
    if (callback) callbacks.push(callback);

    traitNames.forEach((traitName) => {
      const trait = this.traits[traitName];
      if (trait) {
        const traitCallback = trait.getCallback(type, actionName);
        if (traitCallback) callbacks.push(traitCallback);
      }
    });

    return callbacks;
  }

  applyCallbacks(instance, type, actionName, traitNames) {
    const callbacks = this.getCallbacks(type, actionName, traitNames);
    callbacks.forEach(callback => callback(instance));
  }

  static define(factoryName, modelClass, fn) {
    const factory = new Factory(modelClass);
    fn(factory);
    factoryStorage.store(factoryName, factory);
  }

  static build(...args) {
    const parsedArgs = parseArgs(args);

    const factory = factoryStorage.get(parsedArgs.factoryName);
    return factory.build(parsedArgs.traitNames, parsedArgs.customFillers);
  }

  static create(...args) {
    const parsedArgs = parseArgs(args);

    const factory = factoryStorage.get(parsedArgs.factoryName);
    const instance = factory.build(parsedArgs.traitNames, parsedArgs.customFillers);
    factory.applyCallbacks(instance, 'before', 'create', parsedArgs.traitNames);

    instance.save((err, savedInstance) => {
      factory.applyCallbacks(savedInstance, 'after', 'create', parsedArgs.traitNames);
      parsedArgs.callback(err, savedInstance);
    });
  }

  static attributes(...args) {
    const parsedArgs = parseArgs(args);

    const factory = factoryStorage.get(parsedArgs.factoryName);
    const instance = factory.build(parsedArgs.traitNames, parsedArgs.customFillers);
    const obj = instance.toObject();
    delete obj._id;
    return obj;
  }

  static sequence(builder) {
    return ((modelClass, fieldName) =>
      sequence(`${modelClass.modelName}-${fieldName}`, builder)
    );
  }
}

module.exports = Factory;

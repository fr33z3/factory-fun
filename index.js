var factoryStorage = require('./src/factory-storage');
var sequence = require('./src/sequence');
var FactoryTrait = require('./src/factory-trait');
var extend = require('extend');

var Factory = function(modelClass) {
  this._modelClass = modelClass;
  this._fieldFillers = {};
  this._traits = {};
  this._callbacks = { before: {}, after: {} };
}

// Factory functions
Factory.prototype.field = function(name, filler) {
  this._fieldFillers[name] = filler;
}

Factory.prototype.trait = function(name, fn) {
  var trait = new FactoryTrait(fn);
  this._traits[name] = trait;
}

Factory.prototype.build = function(traitNames, customFillers) {
  var instance = new this._modelClass();
  var fieldFillers = this.fieldFillers(traitNames, customFillers);

  this.applyCallbacks(instance, 'before', 'build', traitNames);
  Object.keys(fieldFillers).forEach(function(fieldName) {
    var filler = fieldFillers[fieldName];
    this._applyFiller(instance, fieldName, filler);
  }.bind(this));
  this.applyCallbacks(instance, 'after', 'build', traitNames);

  return instance
}

Factory.prototype._applyFiller = function(instance, fieldName, filler) {
  if (typeof(filler) === 'function') {
    instance[fieldName] = filler(this._modelClass, fieldName)
  } else {
    instance[fieldName] = filler
  };
}

Factory.prototype.fieldFillers = function(traitNames, customFillers) {
  var fillers = extend({}, this._fieldFillers, customFillers);

  traitNames.forEach(function(name) {
    var trait = this._traits[name];
    if (trait) extend(fillers, trait.fieldFillers);
  }.bind(this))

  return fillers
}

Factory.prototype.before = function(actionName, callback) {
  this._callbacks.before[actionName] = callback;
}

Factory.prototype.after = function(actionName, callback) {
  this._callbacks.after[actionName] = callback;
}

Factory.prototype.callbacks = function(type, actionName, traitNames) {
  var callbacks = [];
  var callback = this._callbacks[type][actionName];
  if (callback) callbacks.push(callback);

  traitNames.forEach(function(traitName) {
    var trait = this._traits[traitName];
    if (trait) {
      var callback = trait._callbacks[type][actionName];
      if (callback) callbacks.push(callback);
    }
  }.bind(this))

  return callbacks;
}

Factory.prototype.applyCallbacks = function(instance, type, actionName, traitNames) {
  var callbacks = this.callbacks(type, actionName, traitNames);
  callbacks.forEach(function(callback) {
    callback(instance)
  })
}

// static functions
Factory.define = function(factoryName, modelClass, fn) {
  var factory = new Factory(modelClass);
  fn(factory);
  factoryStorage.store(factoryName, factory);
}

Factory.build = function() {
  var args = parseArgs(arguments);

  var factory = factoryStorage.get(args.factoryName);
  var instance = factory.build(args.traitNames, args.customFillers);
  return instance
}

Factory.create = function() {
  var args = parseArgs(arguments);

  var factory = factoryStorage.get(args.factoryName);
  var instance = factory.build(args.traitNames, args.customFillers);
  factory.applyCallbacks(instance, 'before', 'create', args.traitNames);

  instance.save(function(err, instance) {
    factory.applyCallbacks(instance, 'after', 'create', args.traitNames);
    args.callback(err, instance);
  })
}

Factory.attributes = function() {
  var args = parseArgs(arguments);

  var factory = factoryStorage.get(args.factoryName);
  var instance = factory.build(args.traitNames, args.customFillers);
  var obj = instance.toObject();
  delete obj._id;
  return obj;
}

var parseArgs = function(args) {
  var argsObject = {
    factoryName: args[0],
    traitNames: [],
    customFillers: {},
    callback: undefined
  }

  for(var i=1; i < args.length; i++) {
    var arg = args[i];
    switch(typeof arg) {
      case 'string':
        argsObject.traitNames.push(arg);
        break;
      case 'object':
        argsObject.customFillers = arg;
        break;
      case 'function':
        argsObject.callback = arg;
        break;
    }
  }

  return argsObject
}

Factory.sequence = function(builder) {
  return(function(modelClass, fieldName) {
    var val = sequence(modelClass.modelName + "-" + fieldName, builder);
    return val;
  })
}

module.exports = Factory;

var FactoryTrait = function(fn) {
  this.fieldFillers = {};
  this._callbacks = { before: {}, after: {} };
  fn(this);
}

FactoryTrait.prototype.field = function(name, filler) {
  this.fieldFillers[name] = filler
}

FactoryTrait.prototype.before = function(actionName, callback) {
  this._callbacks.before[actionName] = callback
}

FactoryTrait.prototype.after = function(actionName, callback) {
  this._callbacks.after[actionName] = callback
}

FactoryTrait.prototype.forEach = function(callback) {
  Object.keys(this.fieldFillers).forEach(function(name) {
    callback(this.fieldFillers[name], name)
  })
}

module.exports = FactoryTrait;

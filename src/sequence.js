var Storage = function() {
  this.sequences = {}
};

Storage.prototype.next = function(name) {
  if(!this.sequences[name]) {
    this.sequences[name] = 0
  }

  this.sequences[name] = this.sequences[name] + 1;
  return this.sequences[name];
};

var storage = new Storage();

var sequence = function(name, sequenceBuilder) {
  var nextNum = storage.next(name);
  if (typeof sequenceBuilder === 'function') {
    return sequenceBuilder(nextNum)
  } else if( sequenceBuilder instanceof Array) {
    return sequenceBuilder[(nextNum - 1) % sequenceBuilder.length]
  } else {
    return nextNum
  }
};

module.exports = sequence;

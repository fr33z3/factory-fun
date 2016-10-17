var SequenceStorage = function() {
  this.reset();
};

SequenceStorage.prototype.next = function(name) {
  if(!this.sequences[name]) {
    this.sequences[name] = 0
  }

  this.sequences[name] = this.sequences[name] + 1;
  return this.sequences[name];
};

SequenceStorage.prototype.reset = function() {
  this.sequences = {}
}

var sequenceStorage = new SequenceStorage();
module.exports = sequenceStorage;

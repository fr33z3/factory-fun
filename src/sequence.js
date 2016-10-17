var sequenceStorage = require('./sequence-storage');

var sequence = function(name, sequenceBuilder) {
  var nextNum = sequenceStorage.next(name);
  if (typeof sequenceBuilder === 'function') {
    return sequenceBuilder(nextNum)
  } else if( sequenceBuilder instanceof Array) {
    return sequenceBuilder[(nextNum - 1) % sequenceBuilder.length]
  } else {
    return nextNum
  }
};

module.exports = sequence;

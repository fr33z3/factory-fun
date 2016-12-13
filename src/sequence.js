const sequenceStorage = require('./sequence-storage');

const sequence = (name, sequenceBuilder) => {
  const nextNum = sequenceStorage.next(name);

  if (typeof sequenceBuilder === 'function') {
    return sequenceBuilder(nextNum);
  } else if (sequenceBuilder instanceof Array) {
    return sequenceBuilder[(nextNum - 1) % sequenceBuilder.length];
  }

  return nextNum;
};

module.exports = sequence;

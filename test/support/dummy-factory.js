const Factory = require('../../index.js');
const DummyModel = require('./dummy-model');

const sequence = Factory.sequence;

Factory.define('dummy', DummyModel, () => {});

Factory.define('dummy-with-fields', DummyModel, (dummy) => {
  dummy.field('name', 'Simple Name');
  dummy.field('someInt', 3);

  dummy.trait('some-trait', (trait) => {
    trait.field('name', 'Simple Trait Name');
  });

  dummy.trait('another-trait', (trait) => {
    trait.field('someInt', 5);
  });
});

Factory.define('dummy-with-sequence', DummyModel, (dummy) => {
  dummy.field('intSequence', sequence());
  dummy.field('functionSequence', sequence(n => `some-${n}`));
  dummy.field('circleSequence', sequence(['a', 'b', 'c']));
});

var Factory = require('../../index.js');
var DummyModel = require('./dummy-model');
var sequence = Factory.sequence;

Factory.define('dummy', DummyModel, function() {})

Factory.define('dummy-with-fields', DummyModel, function(dummy) {
  dummy.field('name', 'Simple Name');
  dummy.field('someInt', 3)

  dummy.trait('some-trait', function(trait) {
    trait.field('name', 'Simple Trait Name');
  });

  dummy.trait('another-trait', function(trait) {
    trait.field('someInt', 5);
  })
})

Factory.define('dummy-with-sequence', DummyModel, function(dummy) {
  dummy.field('intSequence', sequence());
  dummy.field('functionSequence', sequence(function(n) { return "some-" + n }));
  dummy.field('circleSequence', sequence(['a', 'b', 'c']));
})

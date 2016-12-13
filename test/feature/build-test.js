const DummyModel = require('../support/dummy-model');
const Factory = require('../../index');
const sequenceStorage = require('../../src/sequence-storage');
const expect = require('chai').expect;

describe('Factory Build', () => {
  describe('when no fields specified', () => {
    let instance;
    before(() => {
      instance = Factory.build('dummy');
    });

    it('creates instance of dummy modal', () => {
      expect(instance).to.be.instanceof(DummyModel);
    });
  });

  describe('when some fields specified', () => {
    it('fills up fields', () => {
      const instance = Factory.build('dummy-with-fields');
      expect(instance.name).to.equal('Simple Name');
      expect(instance.someInt).to.equal(3);
    });

    it('overrides fields', () => {
      const instance = Factory.build('dummy-with-fields', { name: 'Some name' });
      expect(instance.name).to.equal('Some name');
    });
  });

  describe('when fields specified with sequence', () => {
    let instances;

    beforeEach(() => {
      instances = [];
      sequenceStorage.reset();
      for (let i = 0; i < 4; i += 1) {
        instances.push(Factory.build('dummy-with-sequence'));
      }
    });

    it('fills up number sequences', () => {
      expect(instances[0].intSequence).to.equal(1);
      expect(instances[1].intSequence).to.equal(2);
      expect(instances[2].intSequence).to.equal(3);
      expect(instances[3].intSequence).to.equal(4);
    });

    it('fills up function sequences', () => {
      expect(instances[0].functionSequence).to.equal('some-1');
      expect(instances[1].functionSequence).to.equal('some-2');
      expect(instances[2].functionSequence).to.equal('some-3');
      expect(instances[3].functionSequence).to.equal('some-4');
    });

    it('fills up circle sequence', () => {
      expect(instances[0].circleSequence).to.equal('a');
      expect(instances[1].circleSequence).to.equal('b');
      expect(instances[2].circleSequence).to.equal('c');
      expect(instances[3].circleSequence).to.equal('a');
    });
  });

  describe('when using traits', () => {
    it('overrides fields with trait', () => {
      const instance = Factory.build('dummy-with-fields', 'some-trait');
      expect(instance.name).to.equal('Simple Trait Name');
    });

    it('can apply more than one trait', () => {
      const instance = Factory.build('dummy-with-fields', 'some-trait', 'another-trait');
      expect(instance.name).to.equal('Simple Trait Name');
      expect(instance.someInt).to.equal(5);
    });
  });
});

const assert = require('chai').assert;

test(
  'adds 1 to input number',
  function*() {
    maxAPI.outlet({ add1: 3 });
    assert.equal(yield, 4, 'ordinary int');
    maxAPI.outlet({ add1: 0.1 });
    assert.equal(yield, 1.1, 'float val');
    maxAPI.outlet({ add1: 100000 });
    assert.equal(yield, 100001, 'big int');
    maxAPI.outlet({ add1: -2.1 });
    assert.equal(yield, -1.1, 'negative float');
  },
  'add1' // Name of the patcher which you want to test
);

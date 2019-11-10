const { expect } = require('chai');

/**
 *  `classify` is a patcher which has one inlet and two outlets.
 *  If receiving a number, it passes input to the left outlet.
 *  If receiving anything else, it passes input to the right outlet.
 */

test(
  '`classify` passes its input to left outlet if it is a number',
  function*() {
    maxAPI.outlet({ classify: 2 });
    expect(yield, 'natural number').to.include({ outlet0: 2 });
    maxAPI.outlet({ classify: -10 });
    expect(yield, 'negative int').to.include({ outlet0: -10 });
    maxAPI.outlet({ classify: 0.2 });
    expect(yield, 'positive float').to.include({ outlet0: 0.2 });
  },
  'classify'
);
test(
  '`classify`passes its input to right outlet if it is a number',
  function*() {
    maxAPI.outlet({ classify: [0, 1.65, 0.2] });
    expect(yield, 'list of float').to.deep.include({
      outlet1: [0, 1.65, 0.2]
    });
    maxAPI.outlet({ classify: 'Hello world' });
    expect(yield, 'Hello world').to.include({ outlet1: 'Hello world' });
    maxAPI.outlet({ classify: '-1' });
    expect(yield, 'stringified int').to.include({ outlet1: '-1' });
  },
  'classify'
);

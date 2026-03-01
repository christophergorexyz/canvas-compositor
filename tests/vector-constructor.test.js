const test = require('node:test');
const assert = require('node:assert/strict');

const { Vector } = require('../lib/linear-algebra/vector.js');

test('Vector constructor accepts array inputs', () => {
  const vector = new Vector([1, 2, 3]);
  assert.equal(vector.length, 3);
  assert.equal(vector[0], 1);
  assert.equal(vector[2], 3);
});

test('Array methods on Vector do not throw due to numeric constructor path', () => {
  const vector = new Vector([2, 4, 6]);
  const mapped = vector.map((value) => value / 2);

  assert.equal(mapped.length, 3);
  assert.equal(mapped[0], 1);
  assert.equal(mapped[2], 3);
});

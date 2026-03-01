const test = require('node:test');
const assert = require('node:assert/strict');

const { Vector } = require('../lib/linear-algebra/vector.js');

test('Vector.add combines vectors entry-wise', () => {
  const result = Vector.add(new Vector([1, 2]), new Vector([3, 4]));
  assert.deepEqual(Array.from(result), [4, 6]);
});

test('Vector.extrema returns min and max vectors', () => {
  const [min, max] = Vector.extrema(
    new Vector([3, -2]),
    new Vector([1, 5]),
    new Vector([4, 0])
  );

  assert.deepEqual(Array.from(min), [1, -2]);
  assert.deepEqual(Array.from(max), [4, 5]);
});

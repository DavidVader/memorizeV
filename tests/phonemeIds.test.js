import assert from 'node:assert/strict';
import { test } from 'node:test';
import { phonemesToIds } from '../js/domain/phonemeIds.js';

const idMap = { _: [0], '^': [1], $: [2], ' ': [3], a: [14], 'ç': [40], ʊ: [100] };

test('wraps the sounds in start and end marks with pauses in between', () => {
  assert.deepEqual(phonemesToIds(['a', ' ', 'a'], idMap), [1, 0, 14, 0, 3, 0, 14, 0, 2]);
});

test('composes split letters like c plus cedilla into the letter the voice knows', () => {
  assert.deepEqual(phonemesToIds(['c', '̧'], idMap), [1, 0, 40, 0, 2]);
});

test('skips sounds the voice does not know instead of failing', () => {
  assert.deepEqual(phonemesToIds(['a', 'ꜰ', 'ʊ'], idMap), [1, 0, 14, 0, 100, 0, 2]);
});

test('an empty text still gives a valid sequence', () => {
  assert.deepEqual(phonemesToIds([], idMap), [1, 0, 2]);
});

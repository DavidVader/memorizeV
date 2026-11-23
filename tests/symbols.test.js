import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEFAULT_SYMBOL_ID, SYMBOLS, SYMBOL_GROUPS, symbolOf } from '../js/domain/symbols.js';
import { SYMBOL_MARKUP } from '../js/ui/symbolIcons.js';

test('every symbol has a drawing and a known group', () => {
  const groupIds = SYMBOL_GROUPS.map((group) => group.id);
  SYMBOLS.forEach((symbol) => {
    assert.ok(SYMBOL_MARKUP[symbol.id], symbol.id);
    assert.ok(groupIds.includes(symbol.group), symbol.id);
  });
});

test('symbol ids are unique and the star is not offered', () => {
  const ids = SYMBOLS.map((symbol) => symbol.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!ids.includes('star'));
});

test('an unknown symbol falls back to the default', () => {
  assert.equal(symbolOf('gone').id, DEFAULT_SYMBOL_ID);
});

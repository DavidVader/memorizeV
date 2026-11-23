import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Library } from '../js/domain/library.js';
import { MAX_DECORATIONS, createDecorations } from '../js/domain/cardDecoration.js';
import { SYMBOLS } from '../js/domain/symbols.js';

test('creates between zero and three decorations', () => {
  const counts = new Set(Array.from({ length: 200 }, () => createDecorations().length));
  assert.deepEqual([...counts].sort(), Array.from({ length: MAX_DECORATIONS + 1 }, (_, count) => count));
});

test('decorations use known symbols and stay inside the card', () => {
  Array.from({ length: 100 }, () => createDecorations()).flat().forEach((decoration) => {
    assert.ok(SYMBOLS.some((symbol) => symbol.id === decoration.symbolId));
    assert.ok(decoration.x >= 0 && decoration.x <= 100);
    assert.ok(decoration.y >= 0 && decoration.y <= 100);
    assert.ok(decoration.size > 0);
  });
});

test('a fixed random source gives a fixed number of decorations', () => {
  assert.equal(createDecorations(() => 0).length, 0);
  assert.equal(createDecorations(() => 0.99).length, MAX_DECORATIONS);
});

test('a card keeps its decorations after editing and snapshots', () => {
  const library = new Library({ random: () => 0.99 });
  const folder = library.addFolder({ name: 'Englisch' });
  library.addCard(folder.id, { question: 'Hund', answer: 'dog' });
  const [card] = library.cardsIn(folder.id);
  assert.equal(card.decorations.length, MAX_DECORATIONS);

  library.editCard(card.id, { question: 'Katze', answer: 'cat' });
  assert.deepEqual(library.cardsIn(folder.id)[0].decorations, card.decorations);
  assert.deepEqual(new Library(library.snapshot()).cardsIn(folder.id)[0].decorations, card.decorations);
});

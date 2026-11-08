import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseCards, serializeCards } from '../js/files/cardTextCodec.js';

test('parses semicolon separated lines', () => {
  assert.deepEqual(parseCards('Hund;dog\nKatze;cat'), [
    { question: 'Hund', answer: 'dog' },
    { question: 'Katze', answer: 'cat' },
  ]);
});

test('parses tab separated lines and Windows line endings', () => {
  assert.deepEqual(parseCards('Hund\tdog\r\nKatze\tcat\r\n'), [
    { question: 'Hund', answer: 'dog' },
    { question: 'Katze', answer: 'cat' },
  ]);
});

test('keeps further separators inside the answer', () => {
  assert.deepEqual(parseCards('Haus;house; home'), [{ question: 'Haus', answer: 'house; home' }]);
});

test('skips separator-less and half-empty lines in delimited files', () => {
  assert.deepEqual(parseCards('Hund;dog\nnur text\n;leer\nfrage;\n'), [{ question: 'Hund', answer: 'dog' }]);
});

test('parses alternating question and answer lines until the # marker', () => {
  const text = 'Was ist X?  \nX ist Y. \n\nWas ist Z?\nZ ist W; oder V.\n#\nFür die Anzeige in SpearsOnline\n';
  assert.deepEqual(parseCards(text), [
    { question: 'Was ist X?', answer: 'X ist Y.' },
    { question: 'Was ist Z?', answer: 'Z ist W; oder V.' },
  ]);
});

test('ignores a trailing question without answer', () => {
  assert.deepEqual(parseCards('A?\nB\nC?'), [{ question: 'A?', answer: 'B' }]);
});

test('ignores a byte order mark', () => {
  assert.deepEqual(parseCards('﻿Hund;dog'), [{ question: 'Hund', answer: 'dog' }]);
});

test('serializes and parses back to the same cards', () => {
  const cards = [{ question: 'Hund', answer: 'dog' }];
  assert.deepEqual(parseCards(serializeCards(cards)), cards);
});

test('flattens line breaks inside a card on export', () => {
  assert.equal(serializeCards([{ question: 'a\nb', answer: 'c' }]), 'a b\tc\n');
});

test('serializes no cards as empty text', () => {
  assert.equal(serializeCards([]), '');
});

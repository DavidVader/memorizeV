import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Library } from '../js/domain/library.js';
import { orderCards } from '../js/domain/studyOrder.js';
import { createStudySession, parseLimit, selectCards } from '../js/domain/studyPlan.js';

const cards = [{ question: 'b' }, { question: 'a' }, { question: 'c' }];
const questions = (list) => list.map((card) => card.question);

test('sequential keeps the order, reverse flips it', () => {
  assert.deepEqual(questions(orderCards(cards, 'sequential')), ['b', 'a', 'c']);
  assert.deepEqual(questions(orderCards(cards, 'reverse')), ['c', 'a', 'b']);
});

test('alphabetical sorts by question', () => {
  assert.deepEqual(questions(orderCards(cards, 'alphabetical')), ['a', 'b', 'c']);
});

test('random keeps every card exactly once', () => {
  assert.deepEqual(questions(orderCards(cards, 'random')).sort(), ['a', 'b', 'c']);
});

test('parses the limit text', () => {
  assert.equal(parseLimit(''), null);
  assert.equal(parseLimit('0'), null);
  assert.equal(parseLimit('15'), 15);
});

function libraryWithTwoFolders() {
  const library = new Library();
  const first = library.addFolder({ name: 'A' });
  const second = library.addFolder({ name: 'B' });
  library.addCards(first.id, [{ question: '1', answer: 'x' }, { question: '2', answer: 'x' }]);
  library.addCards(second.id, [{ question: '3', answer: 'x' }, { question: '4', answer: 'x' }]);
  return { library, first, second };
}

test('selects cards only from the chosen folders', () => {
  const { library, second } = libraryWithTwoFolders();
  assert.deepEqual(questions(selectCards(library, { folderIds: [second.id], limit: null })), ['3', '4']);
});

test('limits the number of cards across folders', () => {
  const { library, first, second } = libraryWithTwoFolders();
  const selected = selectCards(library, { folderIds: [first.id, second.id], limit: 3 });
  assert.equal(selected.length, 3);
});

test('creates a session in the chosen order', () => {
  const { library, first, second } = libraryWithTwoFolders();
  const session = createStudySession(library, { folderIds: [first.id, second.id], limit: null, orderId: 'reverse' });
  assert.equal(session.currentCard.question, '4');
  assert.equal(session.totalCount, 4);
});

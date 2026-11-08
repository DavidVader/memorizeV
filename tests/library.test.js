import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { Library } from '../js/domain/library.js';

let library;
let folder;

beforeEach(() => {
  library = new Library();
  folder = library.addFolder({ name: '  Englisch ', colorId: 'red' });
});

test('adds a folder with a trimmed name', () => {
  assert.equal(library.folder(folder.id).name, 'Englisch');
});

test('renames and recolors a folder', () => {
  library.editFolder(folder.id, { name: 'Französisch', colorId: 'green' });
  assert.deepEqual(
    { name: library.folder(folder.id).name, colorId: library.folder(folder.id).colorId },
    { name: 'Französisch', colorId: 'green' },
  );
});

test('removing a folder removes its cards', () => {
  library.addCard(folder.id, { question: 'Hund', answer: 'dog' });
  library.removeFolder(folder.id);
  assert.deepEqual(library.snapshot(), { folders: [], cards: [] });
});

test('a card inherits the folder color unless it has its own', () => {
  library.addCard(folder.id, { question: 'Hund', answer: 'dog' });
  library.addCard(folder.id, { question: 'Katze', answer: 'cat', colorId: 'pink' });
  const [inheriting, colored] = library.cardsIn(folder.id);
  assert.equal(library.colorIdOfCard(inheriting), 'red');
  assert.equal(library.colorIdOfCard(colored), 'pink');
});

test('edits and removes a card', () => {
  library.addCard(folder.id, { question: 'Hund', answer: 'dog' });
  const [card] = library.cardsIn(folder.id);
  library.editCard(card.id, { question: 'Katze', answer: 'cat' });
  assert.equal(library.cardsIn(folder.id)[0].question, 'Katze');
  library.removeCard(card.id);
  assert.equal(library.cardsIn(folder.id).length, 0);
});

test('adding a card to an unknown folder fails', () => {
  assert.throws(() => library.addCard('missing', { question: 'a', answer: 'b' }));
});

test('notifies subscribers once per change', () => {
  let notifications = 0;
  library.subscribe(() => (notifications += 1));
  library.addCards(folder.id, [
    { question: 'a', answer: 'b' },
    { question: 'c', answer: 'd' },
  ]);
  assert.equal(notifications, 1);
});

test('restores from a snapshot', () => {
  library.addCard(folder.id, { question: 'Hund', answer: 'dog' });
  assert.deepEqual(new Library(library.snapshot()).snapshot(), library.snapshot());
});

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

test('marked cards appear in the virtual marked folder and can be unmarked', () => {
  library.addCards(folder.id, [
    { question: 'a', answer: 'b' },
    { question: 'c', answer: 'd' },
  ]);
  const [first] = library.cardsIn(folder.id);
  library.toggleMark(first.id);
  assert.deepEqual(library.cardsIn('marked').map((card) => card.question), ['a']);
  library.toggleMark(first.id);
  assert.equal(library.cardsIn('marked').length, 0);
});

test('the marked folder is virtual and cannot receive cards', () => {
  assert.equal(library.folder('marked').isVirtual, true);
  assert.throws(() => library.addCard('marked', { question: 'a', answer: 'b' }));
});

test('editing a card keeps its mark, and a card is never studied twice', () => {
  library.addCard(folder.id, { question: 'a', answer: 'b' });
  const [card] = library.cardsIn(folder.id);
  library.toggleMark(card.id);
  library.editCard(card.id, { question: 'x', answer: 'y' });
  assert.equal(library.cardsIn('marked').length, 1);
  assert.equal(library.cardsInFolders([folder.id, 'marked']).length, 1);
});

test('folders can be nested and report their depth', () => {
  const child = library.addFolder({ name: 'Verben', parentId: folder.id });
  const grandchild = library.addFolder({ name: 'Unregelmäßig', parentId: child.id });
  assert.deepEqual(library.childFolders(folder.id).map((entry) => entry.id), [child.id]);
  assert.deepEqual(library.childFolders(null).map((entry) => entry.id), [folder.id]);
  assert.deepEqual([library.depthOf(folder.id), library.depthOf(child.id), library.depthOf(grandchild.id)], [0, 1, 2]);
});

test('lists folders depth first', () => {
  const other = library.addFolder({ name: 'Mathe' });
  const child = library.addFolder({ name: 'Verben', parentId: folder.id });
  assert.deepEqual(library.foldersInTreeOrder().map((entry) => entry.id), [folder.id, child.id, other.id]);
});

test('a folder cannot be created inside an unknown folder', () => {
  assert.throws(() => library.addFolder({ name: 'x', parentId: 'missing' }));
});

test('removing a folder removes its subfolders and their cards', () => {
  const child = library.addFolder({ name: 'Verben', parentId: folder.id });
  library.addCard(child.id, { question: 'gehen', answer: 'go' });
  library.removeFolder(folder.id);
  assert.deepEqual(library.snapshot(), { folders: [], cards: [] });
});

test('cardsInTree includes the cards of all subfolders', () => {
  const child = library.addFolder({ name: 'Verben', parentId: folder.id });
  library.addCard(folder.id, { question: 'Hund', answer: 'dog' });
  library.addCard(child.id, { question: 'gehen', answer: 'go' });
  assert.equal(library.cardsInTree(folder.id).length, 2);
  assert.equal(library.cardsInTree(child.id).length, 1);
});

test('folders use the circle symbol by default and can change it', () => {
  assert.equal(library.folder(folder.id).symbolId, 'circle');
  library.editFolder(folder.id, { name: 'Englisch', colorId: 'red', symbolId: 'triangle' });
  assert.equal(library.folder(folder.id).symbolId, 'triangle');
});

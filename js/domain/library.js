import { DEFAULT_COLOR_ID } from './palette.js';
import { newId } from './identity.js';

export const MARKED_FOLDER_ID = 'marked';

const MARKED_FOLDER = Object.freeze({
  id: MARKED_FOLDER_ID,
  name: 'Markiert',
  colorId: 'yellow',
  isVirtual: true,
});

export class Library {
  #folders;
  #cards;
  #listeners = [];

  constructor({ folders = [], cards = [] } = {}) {
    this.#folders = folders.map((folder) => ({ ...folder }));
    this.#cards = cards.map((card) => ({ ...card }));
  }

  subscribe(listener) {
    this.#listeners.push(listener);
  }

  snapshot() {
    return {
      folders: this.#folders.map((folder) => ({ ...folder })),
      cards: this.#cards.map((card) => ({ ...card })),
    };
  }

  get folders() {
    return [...this.#folders];
  }

  get foldersWithMarked() {
    return [MARKED_FOLDER, ...this.#folders];
  }

  folder(folderId) {
    return folderId === MARKED_FOLDER_ID ? MARKED_FOLDER : this.#findFolder(folderId);
  }

  cardsIn(folderId) {
    if (folderId === MARKED_FOLDER_ID) return this.#cards.filter((card) => card.marked);
    return this.#cards.filter((card) => card.folderId === folderId);
  }

  cardsInFolders(folderIds) {
    const cards = this.foldersWithMarked
      .filter((folder) => folderIds.includes(folder.id))
      .flatMap((folder) => this.cardsIn(folder.id));
    return [...new Set(cards)];
  }

  addFolder({ name, colorId = DEFAULT_COLOR_ID }) {
    const folder = { id: newId(), name: name.trim(), colorId };
    this.#folders.push(folder);
    this.#changed();
    return folder;
  }

  editFolder(folderId, { name, colorId }) {
    const folder = this.#requireFolder(folderId);
    folder.name = name.trim();
    folder.colorId = colorId;
    this.#changed();
  }

  removeFolder(folderId) {
    this.#folders = this.#folders.filter((folder) => folder.id !== folderId);
    this.#cards = this.#cards.filter((card) => card.folderId !== folderId);
    this.#changed();
  }

  addCard(folderId, { question, answer, colorId = null }) {
    this.#requireFolder(folderId);
    this.#cards.push(this.#createCard(folderId, { question, answer, colorId }));
    this.#changed();
  }

  addCards(folderId, drafts) {
    this.#requireFolder(folderId);
    drafts.forEach((draft) => this.#cards.push(this.#createCard(folderId, draft)));
    this.#changed();
  }

  editCard(cardId, { question, answer, colorId = null }) {
    const card = this.#requireCard(cardId);
    card.question = question.trim();
    card.answer = answer.trim();
    card.colorId = colorId;
    this.#changed();
  }

  toggleMark(cardId) {
    const card = this.#requireCard(cardId);
    card.marked = !card.marked;
    this.#changed();
  }

  removeCard(cardId) {
    this.#cards = this.#cards.filter((card) => card.id !== cardId);
    this.#changed();
  }

  colorIdOfCard(card) {
    return card.colorId ?? this.#requireFolder(card.folderId).colorId;
  }

  #createCard(folderId, { question, answer, colorId = null }) {
    return {
      id: newId(),
      folderId,
      question: question.trim(),
      answer: answer.trim(),
      colorId,
      marked: false,
    };
  }

  #findFolder(folderId) {
    return this.#folders.find((folder) => folder.id === folderId);
  }

  #requireFolder(folderId) {
    const folder = this.#findFolder(folderId);
    if (!folder) throw new Error(`Unknown folder: ${folderId}`);
    return folder;
  }

  #requireCard(cardId) {
    const card = this.#cards.find((candidate) => candidate.id === cardId);
    if (!card) throw new Error(`Unknown card: ${cardId}`);
    return card;
  }

  #changed() {
    this.#listeners.forEach((listener) => listener());
  }
}

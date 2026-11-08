import { DEFAULT_COLOR_ID } from './palette.js';
import { newId } from './identity.js';

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

  folder(folderId) {
    return this.#folders.find((folder) => folder.id === folderId);
  }

  cardsIn(folderId) {
    return this.#cards.filter((card) => card.folderId === folderId);
  }

  cardsInFolders(folderIds) {
    return this.#folders
      .filter((folder) => folderIds.includes(folder.id))
      .flatMap((folder) => this.cardsIn(folder.id));
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
    };
  }

  #requireFolder(folderId) {
    const folder = this.folder(folderId);
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

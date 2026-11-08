import { Library } from '../domain/library.js';

const STORAGE_KEY = 'memorizeV.library.v1';

export function loadLibrary(storage = localStorage) {
  try {
    const stored = storage.getItem(STORAGE_KEY);
    return new Library(stored ? JSON.parse(stored) : undefined);
  } catch {
    return new Library();
  }
}

export function saveLibrary(library, storage = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(library.snapshot()));
}

export function saveOnEveryChange(library, storage = localStorage) {
  library.subscribe(() => saveLibrary(library, storage));
}

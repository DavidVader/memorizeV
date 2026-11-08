import { DEFAULT_ORDER_ID, orderCards, pickRandom } from './studyOrder.js';
import { StudySession } from './studySession.js';

export function defaultSettings() {
  return { folderIds: null, limitText: '', orderId: DEFAULT_ORDER_ID };
}

export function planFromSettings(library, settings, overrides = {}) {
  const merged = { ...settings, ...overrides };
  return {
    folderIds: resolveFolderIds(library, merged.folderIds),
    limit: parseLimit(merged.limitText),
    orderId: merged.orderId,
  };
}

export function resolveFolderIds(library, folderIds) {
  if (folderIds === null) return library.folders.map((folder) => folder.id);
  const knownIds = library.foldersWithMarked.map((folder) => folder.id);
  return folderIds.filter((id) => knownIds.includes(id));
}

export function parseLimit(text) {
  const limit = Number.parseInt(text, 10);
  return limit > 0 ? limit : null;
}

export function selectCards(library, { folderIds, limit }) {
  const pool = library.cardsInFolders(folderIds);
  return limit && limit < pool.length ? pickRandom(pool, limit) : pool;
}

export function createStudySession(library, plan) {
  return new StudySession(orderCards(selectCards(library, plan), plan.orderId));
}

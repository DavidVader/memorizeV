import { DEFAULT_ORDER_ID, orderCards, pickRandom } from './studyOrder.js';
import { StudySession } from './studySession.js';

export function defaultSetup(folderIds) {
  return { folderIds: [...folderIds], limitText: '', orderId: DEFAULT_ORDER_ID };
}

export function planFromSetup({ folderIds, limitText, orderId }) {
  return { folderIds, limit: parseLimit(limitText), orderId };
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

export const STUDY_ORDERS = [
  { id: 'sequential', name: 'Erste → Letzte' },
  { id: 'reverse', name: 'Letzte → Erste' },
  { id: 'random', name: 'Zufällig' },
  { id: 'alphabetical', name: 'A → Z' },
];

export const DEFAULT_ORDER_ID = 'random';

export function orderCards(cards, orderId) {
  if (orderId === 'reverse') return [...cards].reverse();
  if (orderId === 'random') return shuffled(cards);
  if (orderId === 'alphabetical') return [...cards].sort(byQuestion);
  return [...cards];
}

export function pickRandom(cards, count) {
  const picked = new Set(shuffled(cards).slice(0, count));
  return cards.filter((card) => picked.has(card));
}

export function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function byQuestion(first, second) {
  return first.question.localeCompare(second.question, 'de', { sensitivity: 'base' });
}

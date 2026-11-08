import { el } from './dom.js';

export function markButton(library, card) {
  return el(
    'button',
    {
      className: `mark-button${card.marked ? ' active' : ''}`,
      ariaLabel: card.marked ? 'Markierung entfernen' : 'Karte markieren',
      onclick: () => library.toggleMark(card.id),
    },
    card.marked ? '★' : '☆',
  );
}

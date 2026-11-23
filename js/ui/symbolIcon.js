import { SHAPES_GROUP_ID, symbolOf } from '../domain/symbols.js';
import { el } from './dom.js';
import { SYMBOL_MARKUP } from './symbolIcons.js';

export function symbolIcon(symbolId, { outlined = false } = {}) {
  const symbol = symbolOf(symbolId);
  const isSolid = symbol.group === SHAPES_GROUP_ID && !outlined;
  return el('span', {
    className: `symbol${isSolid ? ' solid' : ''}${outlined ? ' outlined' : ''}`,
    innerHTML: `<svg viewBox="0 0 24 24" aria-hidden="true">${SYMBOL_MARKUP[symbol.id]}</svg>`,
  });
}

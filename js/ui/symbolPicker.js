import { SYMBOL_GROUPS, symbolsInGroup } from '../domain/symbols.js';
import { el } from './dom.js';
import { symbolIcon } from './symbolIcon.js';

export function symbolPicker({ selectedId, outlined, onChange }) {
  const container = el('div', { className: 'symbol-picker' });
  let selection = selectedId;

  const select = (symbolId) => {
    selection = symbolId;
    onChange(symbolId);
    render();
  };

  const render = () => {
    container.replaceChildren(
      ...SYMBOL_GROUPS.map((group) => symbolGroup(group, selection, outlined, select)),
    );
  };

  render();
  return container;
}

function symbolGroup(group, selectedId, outlined, onSelect) {
  return el(
    'div',
    { className: 'symbol-group' },
    el('span', { className: 'symbol-group-title' }, group.name),
    el(
      'div',
      { className: 'symbol-grid' },
      symbolsInGroup(group.id).map((symbol) =>
        el(
          'button',
          {
            type: 'button',
            className: `symbol-option${selectedId === symbol.id ? ' selected' : ''}`,
            title: symbol.name,
            ariaLabel: symbol.name,
            onclick: () => onSelect(symbol.id),
          },
          symbolIcon(symbol.id, { outlined }),
        ),
      ),
    ),
  );
}

import { PALETTE, hexOf } from '../domain/palette.js';
import { el } from './dom.js';

export function colorPicker({ selectedId, onChange, inheritLabel = null }) {
  const container = el('div', { className: 'color-picker' });
  let selection = selectedId;

  const select = (colorId) => {
    selection = colorId;
    onChange(colorId);
    render();
  };

  const render = () => {
    const swatches = PALETTE.map((color) => swatch(color, selection === color.id, () => select(color.id)));
    const inherit = inheritLabel && inheritOption(inheritLabel, selection === null, () => select(null));
    container.replaceChildren(...[inherit, ...swatches].filter(Boolean));
  };

  render();
  return container;
}

function swatch(color, isSelected, onSelect) {
  return el('button', {
    type: 'button',
    className: `swatch${isSelected ? ' selected' : ''}`,
    title: color.name,
    ariaLabel: color.name,
    vars: { '--swatch': hexOf(color.id) },
    onclick: onSelect,
  });
}

function inheritOption(label, isSelected, onSelect) {
  return el(
    'button',
    { type: 'button', className: `inherit-option${isSelected ? ' selected' : ''}`, onclick: onSelect },
    label,
  );
}

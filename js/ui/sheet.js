import { el } from './dom.js';

export function openSheet(buildContent) {
  const backdrop = el('div', {
    className: 'sheet-backdrop',
    onclick: (event) => event.target === backdrop && close(),
  });
  const close = () => backdrop.remove();

  backdrop.append(el('div', { className: 'sheet' }, buildContent(close)));
  document.body.append(backdrop);
  return close;
}

export function sheetHeader(title, close) {
  return el(
    'div',
    { className: 'sheet-header' },
    el('button', { className: 'text-button', onclick: close }, 'Abbrechen'),
    el('h2', {}, title),
    el('span', { className: 'sheet-header-spacer' }),
  );
}

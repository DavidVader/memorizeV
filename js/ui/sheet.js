import { el } from './dom.js';

// buildContent(close) liefert { title, body, actions }:
// Titel und Abbrechen bleiben oben, die Aktionen unten fest, nur der Inhalt scrollt.
export function openSheet(buildContent) {
  const backdrop = el('div', {
    className: 'sheet-backdrop',
    onclick: (event) => event.target === backdrop && close(),
  });
  const close = () => backdrop.remove();
  const { title, body, actions = [] } = buildContent(close);

  backdrop.append(
    el(
      'div',
      { className: 'sheet' },
      sheetHeader(title, close),
      el('div', { className: 'sheet-body' }, body),
      actions.some(Boolean) && el('div', { className: 'sheet-actions' }, actions),
    ),
  );
  document.body.append(backdrop);
  return close;
}

function sheetHeader(title, close) {
  return el(
    'div',
    { className: 'sheet-header' },
    el('button', { className: 'text-button', onclick: close }, 'Abbrechen'),
    el('h2', {}, title),
    el('span', { className: 'sheet-header-spacer' }),
  );
}

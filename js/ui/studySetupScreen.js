import { hexOf } from '../domain/palette.js';
import { STUDY_ORDERS } from '../domain/studyOrder.js';
import { createStudySession, planFromSetup, selectCards } from '../domain/studyPlan.js';
import { el } from './dom.js';

export function studySetupScreen(context, route) {
  const { library, go, refresh } = context;
  const { setup } = route;
  const plan = planFromSetup(setup);
  const availableCount = selectCards(library, plan).length;

  const toggleFolder = (folderId) => {
    const selected = setup.folderIds.includes(folderId);
    setup.folderIds = selected
      ? setup.folderIds.filter((id) => id !== folderId)
      : [...setup.folderIds, folderId];
    refresh();
  };

  const selectAllFolders = () => {
    const allSelected = setup.folderIds.length === library.folders.length;
    setup.folderIds = allSelected ? [] : library.folders.map((folder) => folder.id);
    refresh();
  };

  const start = () => go({ name: 'study', plan, session: createStudySession(library, plan), backTo: route.backTo });

  return el(
    'main',
    { className: 'screen' },
    el(
      'header',
      { className: 'top-bar' },
      el('button', { className: 'icon-button', ariaLabel: 'Zurück', onclick: () => go(route.backTo) }, '‹'),
      el('h1', {}, 'Lernen'),
      el('button', { className: 'text-button', onclick: selectAllFolders }, 'Alle'),
    ),
    section('Ordner', folderChoices(library, setup, toggleFolder)),
    section('Anzahl Karten', limitInput(setup, refresh)),
    section('Reihenfolge', orderChoices(setup, refresh)),
    el('button', { className: 'primary-button start-button', disabled: availableCount === 0, onclick: start }, `Starten (${availableCount})`),
  );
}

function section(title, content) {
  return el('section', { className: 'setup-section' }, el('h2', {}, title), content);
}

function folderChoices(library, setup, toggleFolder) {
  return el(
    'ul',
    { className: 'list' },
    library.folders.map((folder) =>
      el(
        'li',
        {},
        el(
          'button',
          { className: 'row', vars: { '--accent': hexOf(folder.colorId) }, onclick: () => toggleFolder(folder.id) },
          el('span', { className: 'dot' }),
          el('span', { className: 'row-title' }, folder.name),
          el('span', { className: 'row-detail' }, String(library.cardsIn(folder.id).length)),
          el('span', { className: 'check' }, setup.folderIds.includes(folder.id) ? '✓' : ''),
        ),
      ),
    ),
  );
}

function limitInput(setup, refresh) {
  return el('input', {
    onchange: refresh,
    className: 'text-field',
    type: 'number',
    inputMode: 'numeric',
    min: 1,
    placeholder: 'Alle (leer lassen) oder z. B. 10',
    value: setup.limitText,
    oninput: (event) => (setup.limitText = event.target.value),
  });
}

function orderChoices(setup, refresh) {
  return el(
    'div',
    { className: 'segmented' },
    STUDY_ORDERS.map((order) =>
      el(
        'button',
        {
          className: setup.orderId === order.id ? 'selected' : '',
          onclick: () => {
            setup.orderId = order.id;
            refresh();
          },
        },
        order.name,
      ),
    ),
  );
}

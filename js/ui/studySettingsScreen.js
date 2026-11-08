import { hexOf } from '../domain/palette.js';
import { STUDY_ORDERS } from '../domain/studyOrder.js';
import { planFromSettings, resolveFolderIds, selectCards } from '../domain/studyPlan.js';
import { saveStudySettings } from '../storage/studySettingsStorage.js';
import { el } from './dom.js';
import { folderIcon } from './folderIcon.js';
import { startStudy } from './studyLauncher.js';

export function studySettingsScreen(context, route) {
  const { library, go, refresh } = context;
  const { settings } = route;
  const selectedIds = resolveFolderIds(library, settings.folderIds);
  const availableCount = selectCards(library, planFromSettings(library, settings)).length;

  const change = (changes) => {
    Object.assign(settings, changes);
    saveStudySettings(settings);
    refresh();
  };

  const toggleFolder = (folderId) => {
    const isSelected = selectedIds.includes(folderId);
    change({ folderIds: isSelected ? selectedIds.filter((id) => id !== folderId) : [...selectedIds, folderId] });
  };

  const toggleAll = () => {
    const allIds = library.foldersWithMarked.map((folder) => folder.id);
    change({ folderIds: selectedIds.length === allIds.length ? [] : allIds });
  };

  return el(
    'main',
    { className: 'screen' },
    el(
      'header',
      { className: 'top-bar' },
      el('button', { className: 'icon-button', ariaLabel: 'Zurück', onclick: () => go(route.backTo) }, '‹'),
      el('h1', {}, 'Lern-Einstellungen'),
      el('button', { className: 'text-button', onclick: toggleAll }, 'Alle'),
    ),
    section('Ordner', folderChoices(library, selectedIds, toggleFolder)),
    section('Anzahl Karten', limitInput(settings, change)),
    section('Reihenfolge', orderChoices(settings, change)),
    el(
      'button',
      { className: 'primary-button start-button', disabled: availableCount === 0, onclick: () => startStudy(context, route.backTo) },
      `Starten (${availableCount} Karten)`,
    ),
  );
}

function section(title, content) {
  return el('section', { className: 'setup-section' }, el('h2', {}, title), content);
}

function folderChoices(library, selectedIds, toggleFolder) {
  return el(
    'ul',
    { className: 'list' },
    library.foldersWithMarked.map((folder) =>
      el(
        'li',
        {},
        el(
          'button',
          { className: 'row', vars: { '--accent': hexOf(folder.colorId) }, onclick: () => toggleFolder(folder.id) },
          folderIcon(folder),
          el('span', { className: 'row-title' }, folder.name),
          el('span', { className: 'row-detail' }, String(library.cardsIn(folder.id).length)),
          el('span', { className: 'check' }, selectedIds.includes(folder.id) ? '✓' : ''),
        ),
      ),
    ),
  );
}

function limitInput(settings, change) {
  return el('input', {
    className: 'text-field',
    type: 'number',
    inputMode: 'numeric',
    min: 1,
    placeholder: 'Alle (leer lassen) oder z. B. 10',
    value: settings.limitText,
    onchange: (event) => change({ limitText: event.target.value }),
  });
}

function orderChoices(settings, change) {
  return el(
    'div',
    { className: 'segmented' },
    STUDY_ORDERS.map((order) =>
      el(
        'button',
        {
          className: settings.orderId === order.id ? 'selected' : '',
          onclick: () => change({ orderId: order.id }),
        },
        order.name,
      ),
    ),
  );
}

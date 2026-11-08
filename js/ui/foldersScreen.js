import { hexOf } from '../domain/palette.js';
import { STUDY_ORDERS } from '../domain/studyOrder.js';
import { planFromSettings, selectCards } from '../domain/studyPlan.js';
import { importFilesAsFolders } from '../files/transferActions.js';
import { loadStudySettings } from '../storage/studySettingsStorage.js';
import { el } from './dom.js';
import { folderIcon } from './folderIcon.js';
import { openFolderSheet } from './folderSheet.js';
import { openStudySettings, startStudy } from './studyLauncher.js';

const HOME = { name: 'folders' };

export function foldersScreen(context) {
  const { library } = context;

  const importFolders = async () => {
    const message = await importFilesAsFolders(library);
    if (message) alert(message);
  };

  return el(
    'main',
    { className: 'screen' },
    el(
      'header',
      { className: 'top-bar' },
      el('h1', {}, 'memorizeV'),
      el('button', { className: 'icon-button', ariaLabel: 'Import', onclick: importFolders }, '⬆︎'),
      el('button', { className: 'icon-button', ariaLabel: 'Neuer Ordner', onclick: () => openFolderSheet(context) }, '+'),
    ),
    library.folders.length === 0 ? emptyState() : [studyBar(context), folderList(context)],
  );
}

function studyBar(context) {
  return el(
    'section',
    {},
    el(
      'div',
      { className: 'toolbar' },
      el('button', { className: 'primary-button', onclick: () => startStudy(context, HOME) }, 'Lernen'),
      el('button', { className: 'secondary-button settings-button', ariaLabel: 'Lern-Einstellungen', onclick: () => openStudySettings(context, HOME) }, '⚙︎'),
    ),
    el('p', { className: 'study-summary' }, studySummary(context.library)),
  );
}

function studySummary(library) {
  const plan = planFromSettings(library, loadStudySettings());
  const orderName = STUDY_ORDERS.find((order) => order.id === plan.orderId).name;
  return `${selectCards(library, plan).length} Karten · ${orderName}`;
}

function folderList({ library, go }) {
  return el(
    'ul',
    { className: 'list' },
    library.foldersWithMarked.map((folder) =>
      el(
        'li',
        {},
        el(
          'button',
          {
            className: 'row',
            vars: { '--accent': hexOf(folder.colorId) },
            onclick: () => go({ name: 'folder', folderId: folder.id }),
          },
          folderIcon(folder),
          el('span', { className: 'row-title' }, folder.name),
          el('span', { className: 'row-detail' }, String(library.cardsIn(folder.id).length)),
          el('span', { className: 'chevron' }, '›'),
        ),
      ),
    ),
  );
}

function emptyState() {
  return el(
    'p',
    { className: 'empty' },
    'Noch keine Ordner.',
    el('br'),
    'Tippe auf + oder importiere .txt Dateien mit ⬆︎.',
  );
}

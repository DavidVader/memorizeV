import { MARKED_FOLDER_ID } from '../domain/library.js';
import { STUDY_ORDERS } from '../domain/studyOrder.js';
import { planFromSettings, selectCards } from '../domain/studyPlan.js';
import { importFilesAsFolders } from '../files/transferActions.js';
import { loadStudySettings } from '../storage/studySettingsStorage.js';
import { el } from './dom.js';
import { folderList } from './folderList.js';
import { openFolderSheet } from './folderSheet.js';
import { openStudySettings, startStudy } from './studyLauncher.js';

const HOME = { name: 'folders' };

export function foldersScreen(context) {
  const { library } = context;
  const rootFolders = library.childFolders(null);
  const markedFolder = library.folder(MARKED_FOLDER_ID);

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
    rootFolders.length === 0 ? emptyState() : [studyBar(context), folderList(library, [markedFolder, ...rootFolders], context.go)],
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

function emptyState() {
  return el(
    'p',
    { className: 'empty' },
    'Noch keine Ordner.',
    el('br'),
    'Tippe auf + oder importiere .txt Dateien mit ⬆︎.',
  );
}

import { hexOf } from '../domain/palette.js';
import { defaultSetup } from '../domain/studyPlan.js';
import { importFilesAsFolders } from '../files/transferActions.js';
import { el } from './dom.js';
import { openFolderSheet } from './folderSheet.js';

export function foldersScreen(context) {
  const { library } = context;

  const importFolders = async () => {
    const message = await importFilesAsFolders(library);
    if (message) alert(message);
  };

  const openStudySetup = () =>
    context.go({
      name: 'studySetup',
      setup: defaultSetup(library.folders.map((folder) => folder.id)),
      backTo: { name: 'folders' },
    });

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
    library.folders.length > 0 &&
      el(
        'div',
        { className: 'toolbar' },
        el('button', { className: 'primary-button', onclick: openStudySetup }, 'Lernen: Mix aus Ordnern'),
      ),
    library.folders.length === 0 ? emptyState() : folderList(context),
  );
}

function folderList({ library, go }) {
  return el(
    'ul',
    { className: 'list' },
    library.folders.map((folder) =>
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
          el('span', { className: 'dot' }),
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
    'Tippe auf + oder importiere eine .txt Datei mit ⬆︎.',
  );
}

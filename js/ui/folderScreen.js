import { hexOf } from '../domain/palette.js';
import { exportFolder, importFilesAsFolders } from '../files/transferActions.js';
import { openAddItemSheet } from './addItemSheet.js';
import { openCardSheet } from './cardSheet.js';
import { el } from './dom.js';
import { folderList } from './folderList.js';
import { markButton } from './markButton.js';
import { openFolderSheet } from './folderSheet.js';
import { parentRoute } from './routes.js';
import { startStudy } from './studyLauncher.js';

export function folderScreen(context, folderId) {
  const { library, go } = context;
  const folder = library.folder(folderId);
  const cards = library.cardsIn(folderId);
  const subfolders = library.childFolders(folderId);
  const isEmpty = cards.length === 0 && subfolders.length === 0;
  const studyableCount = library.cardsInTree(folderId).length;
  const isEditable = !folder.isVirtual;

  const importCards = async () => {
    const message = await importFilesAsFolders(library, folderId);
    if (message) alert(message);
  };

  const study = () =>
    startStudy(context, { name: 'folder', folderId }, { folderIds: library.folderAndDescendantIds(folderId), limitText: '' });

  return el(
    'main',
    { className: 'screen', vars: { '--accent': hexOf(folder.colorId) } },
    el(
      'header',
      { className: 'top-bar' },
      el('button', { className: 'icon-button', ariaLabel: 'Zurück', onclick: () => go(parentRoute(folder)) }, '‹'),
      el('h1', {}, folder.name),
      isEditable
        ? el('button', { className: 'icon-button', ariaLabel: 'Ordner bearbeiten', onclick: () => openFolderSheet(context, folder) }, '✎')
        : el('span', { className: 'icon-button' }),
    ),
    el(
      'div',
      { className: 'toolbar' },
      el('button', { className: 'primary-button', disabled: studyableCount === 0, onclick: study }, 'Lernen'),
      isEditable && el('button', { className: 'secondary-button', onclick: importCards }, 'Import'),
      el('button', { className: 'secondary-button', disabled: cards.length === 0, onclick: () => exportFolder(library, folderId) }, 'Export'),
    ),
    subfolders.length > 0 && folderList(library, subfolders, go),
    cards.length > 0 && cardList(context, cards),
    isEmpty && emptyState(isEditable),
    isEditable && el('button', { className: 'fab', ariaLabel: 'Neu erstellen', onclick: () => openAddItemSheet(context, folderId) }, '+'),
  );
}

function cardList(context, cards) {
  return el(
    'ul',
    { className: 'list' },
    cards.map((card) =>
      el(
        'li',
        { className: 'card-item', vars: { '--accent': hexOf(context.library.colorIdOfCard(card)) } },
        el(
          'button',
          { className: 'row card-row', onclick: () => openCardSheet(context, card.folderId, card) },
          el('span', { className: 'bar' }),
          el('span', { className: 'card-text' }, el('strong', {}, card.question), el('span', {}, card.answer)),
        ),
        markButton(context.library, card),
      ),
    ),
  );
}

function emptyState(isEditable) {
  return isEditable
    ? el('p', { className: 'empty' }, 'Dieser Ordner ist leer.', el('br'), 'Tippe auf +, um eine Karte oder einen Ordner zu erstellen.')
    : el('p', { className: 'empty' }, 'Noch keine markierten Karten.', el('br'), 'Tippe auf ☆ bei einer Karte, um sie zu markieren.');
}

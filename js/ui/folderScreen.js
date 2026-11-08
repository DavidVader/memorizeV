import { hexOf } from '../domain/palette.js';
import { defaultSetup } from '../domain/studyPlan.js';
import { exportFolder, importFilesIntoFolder } from '../files/transferActions.js';
import { openCardSheet } from './cardSheet.js';
import { el } from './dom.js';
import { openFolderSheet } from './folderSheet.js';

export function folderScreen(context, folderId) {
  const { library, go } = context;
  const folder = library.folder(folderId);
  const cards = library.cardsIn(folderId);

  const importCards = async () => {
    const message = await importFilesIntoFolder(library, folderId);
    if (message) alert(message);
  };

  const openStudySetup = () =>
    go({ name: 'studySetup', setup: defaultSetup([folderId]), backTo: { name: 'folder', folderId } });

  return el(
    'main',
    { className: 'screen', vars: { '--accent': hexOf(folder.colorId) } },
    el(
      'header',
      { className: 'top-bar' },
      el('button', { className: 'icon-button', ariaLabel: 'Zurück', onclick: () => go({ name: 'folders' }) }, '‹'),
      el('h1', {}, folder.name),
      el('button', { className: 'icon-button', ariaLabel: 'Ordner bearbeiten', onclick: () => openFolderSheet(context, folder) }, '✎'),
    ),
    el(
      'div',
      { className: 'toolbar' },
      el('button', { className: 'primary-button', disabled: cards.length === 0, onclick: openStudySetup }, 'Lernen'),
      el('button', { className: 'secondary-button', onclick: importCards }, 'Import'),
      el('button', { className: 'secondary-button', disabled: cards.length === 0, onclick: () => exportFolder(library, folderId) }, 'Export'),
    ),
    cards.length === 0 ? emptyState() : cardList(context, cards),
    el('button', { className: 'fab', ariaLabel: 'Neue Karte', onclick: () => openCardSheet(context, folderId) }, '+'),
  );
}

function cardList(context, cards) {
  return el(
    'ul',
    { className: 'list' },
    cards.map((card) =>
      el(
        'li',
        {},
        el(
          'button',
          {
            className: 'row card-row',
            vars: { '--accent': hexOf(context.library.colorIdOfCard(card)) },
            onclick: () => openCardSheet(context, card.folderId, card),
          },
          el('span', { className: 'bar' }),
          el('span', { className: 'card-text' }, el('strong', {}, card.question), el('span', {}, card.answer)),
        ),
      ),
    ),
  );
}

function emptyState() {
  return el('p', { className: 'empty' }, 'Dieser Ordner ist leer.', el('br'), 'Tippe auf +, um eine Karte zu erstellen.');
}

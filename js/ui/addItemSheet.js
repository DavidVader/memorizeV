import { openCardSheet } from './cardSheet.js';
import { el } from './dom.js';
import { openFolderSheet } from './folderSheet.js';
import { openSheet, sheetHeader } from './sheet.js';

export function openAddItemSheet(context, folderId) {
  openSheet((close) => {
    const chooseAndClose = (openNextSheet) => () => {
      close();
      openNextSheet();
    };

    return [
      sheetHeader('Neu erstellen', close),
      el('button', { className: 'primary-button', onclick: chooseAndClose(() => openCardSheet(context, folderId)) }, 'Karte'),
      el('button', { className: 'primary-button', onclick: chooseAndClose(() => openFolderSheet(context, null, folderId)) }, 'Ordner'),
    ];
  });
}

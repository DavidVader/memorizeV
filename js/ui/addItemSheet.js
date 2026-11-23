import { openCardSheet } from './cardSheet.js';
import { el } from './dom.js';
import { openFolderSheet } from './folderSheet.js';
import { openSheet } from './sheet.js';

export function openAddItemSheet(context, folderId) {
  openSheet((close) => {
    const chooseAndClose = (openNextSheet) => () => {
      close();
      openNextSheet();
    };

    return {
      title: 'Neu erstellen',
      body: [
        el('button', { className: 'primary-button', onclick: chooseAndClose(() => openCardSheet(context, folderId)) }, 'Karte'),
        el('button', { className: 'primary-button', onclick: chooseAndClose(() => openFolderSheet(context, null, folderId)) }, 'Ordner'),
      ],
    };
  });
}

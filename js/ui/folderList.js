import { hexOf } from '../domain/palette.js';
import { el } from './dom.js';
import { folderIcon } from './folderIcon.js';

export function folderList(library, folders, go) {
  return el(
    'ul',
    { className: 'list' },
    folders.map((folder) =>
      el(
        'li',
        dragAttributes(folder),
        el(
          'button',
          {
            className: 'row',
            vars: { '--accent': hexOf(folder.colorId) },
            onclick: () => go({ name: 'folder', folderId: folder.id }),
          },
          folderIcon(folder),
          el('span', { className: 'row-title' }, folder.name),
          el('span', { className: 'row-detail' }, String(library.cardsInTree(folder.id).length)),
          el('span', { className: 'chevron' }, '›'),
        ),
      ),
    ),
  );
}

// Der virtuelle Ordner "Markiert" bleibt oben stehen und lässt sich nicht verschieben.
function dragAttributes(folder) {
  if (folder.isVirtual) return {};
  return { 'data-drag-kind': 'folder', 'data-drag-id': folder.id };
}

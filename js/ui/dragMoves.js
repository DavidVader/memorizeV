import { enableDragAndDrop } from './dragAndDrop.js';

const ROOT_LABEL = 'In die Hauptebene verschieben';

// Verbindet Drag & Drop mit der Bibliothek. currentFolderId ist der Ordner, dessen Inhalt gezeigt wird (null = Startseite).
export function installDragMoves(screen, library, currentFolderId) {
  const currentFolder = currentFolderId === null ? null : library.folder(currentFolderId);

  enableDragAndDrop(screen, {
    canDropInto: (kind, id, targetFolderId) => kind !== 'folder' || library.canMoveFolderInto(id, targetFolderId),
    upTarget: (kind) => upTargetFor(kind, currentFolder, library),
    onDrop: ({ kind, id, target }) => moveItem(library, { kind, id, target, currentFolder }),
  });
}

function upTargetFor(kind, currentFolder, library) {
  if (!currentFolder) return null;
  const parentId = currentFolder.parentId ?? null;
  if (parentId === null) return kind === 'folder' ? { label: ROOT_LABEL } : null;
  return { label: `In „${library.folder(parentId).name}“ verschieben` };
}

function moveItem(library, { kind, id, target, currentFolder }) {
  const currentFolderId = currentFolder?.id ?? null;
  const parentId = currentFolder?.parentId ?? null;

  if (kind === 'folder') {
    if (target.type === 'into') library.moveFolder(id, target.folderId);
    else if (target.type === 'up') library.moveFolder(id, parentId);
    else library.moveFolder(id, currentFolderId, target.beforeId);
    return;
  }

  if (target.type === 'into') library.moveCard(id, target.folderId);
  else if (target.type === 'up') library.moveCard(id, parentId);
  else library.moveCard(id, currentFolderId, target.beforeId);
}

export function parentRoute(folder) {
  return folder.parentId ? { name: 'folder', folderId: folder.parentId } : { name: 'folders' };
}

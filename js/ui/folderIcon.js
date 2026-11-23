import { el } from './dom.js';

export function folderIcon(folder) {
  if (folder.isVirtual) return el('span', { className: 'star-icon' }, '★');
  const isSubfolder = Boolean(folder.parentId);
  return el('span', { className: `dot${isSubfolder ? ' ring' : ''}` });
}

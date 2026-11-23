import { el } from './dom.js';
import { symbolIcon } from './symbolIcon.js';

export function folderIcon(folder) {
  if (folder.isVirtual) return el('span', { className: 'star-icon' }, '★');
  return symbolIcon(folder.symbolId, { outlined: Boolean(folder.parentId) });
}

import { el } from './dom.js';

export function folderIcon(folder) {
  return folder.isVirtual ? el('span', { className: 'star-icon' }, '★') : el('span', { className: 'dot' });
}

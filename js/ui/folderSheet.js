import { DEFAULT_COLOR_ID } from '../domain/palette.js';
import { colorPicker } from './colorPicker.js';
import { el } from './dom.js';
import { parentRoute } from './routes.js';
import { openSheet, sheetHeader } from './sheet.js';

export function openFolderSheet(context, existingFolder = null, parentId = null) {
  openSheet((close) => {
    let colorId = existingFolder?.colorId ?? DEFAULT_COLOR_ID;
    const nameInput = el('input', {
      type: 'text',
      placeholder: 'Name des Ordners',
      value: existingFolder?.name ?? '',
      maxLength: 60,
    });

    const save = () => {
      if (!nameInput.value.trim()) return nameInput.focus();
      if (existingFolder) context.library.editFolder(existingFolder.id, { name: nameInput.value, colorId });
      else context.library.addFolder({ name: nameInput.value, colorId, parentId });
      close();
    };

    const remove = () => {
      if (!confirm(`Ordner "${existingFolder.name}" mit allen Unterordnern und Karten löschen?`)) return;
      context.go(parentRoute(existingFolder));
      context.library.removeFolder(existingFolder.id);
      close();
    };

    setTimeout(() => nameInput.focus());
    return [
      sheetHeader(existingFolder ? 'Ordner bearbeiten' : 'Neuer Ordner', close),
      el('label', {}, 'Name', nameInput),
      el(
        'div',
        { className: 'field' },
        el('span', { className: 'field-label' }, 'Farbe'),
        colorPicker({ selectedId: colorId, onChange: (id) => (colorId = id) }),
      ),
      el('button', { className: 'primary-button', onclick: save }, 'Sichern'),
      existingFolder && el('button', { className: 'danger-button', onclick: remove }, 'Ordner löschen'),
    ];
  });
}

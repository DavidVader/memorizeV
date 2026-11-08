import { colorPicker } from './colorPicker.js';
import { el } from './dom.js';
import { openSheet, sheetHeader } from './sheet.js';

export function openCardSheet(context, folderId, existingCard = null) {
  openSheet((close) => {
    let colorId = existingCard?.colorId ?? null;
    const questionInput = el('textarea', {
      placeholder: 'Frage / Vokabel',
      rows: 2,
      value: existingCard?.question ?? '',
    });
    const answerInput = el('textarea', {
      placeholder: 'Antwort / Übersetzung',
      rows: 2,
      value: existingCard?.answer ?? '',
    });

    const save = () => {
      if (!questionInput.value.trim()) return questionInput.focus();
      if (!answerInput.value.trim()) return answerInput.focus();
      const content = { question: questionInput.value, answer: answerInput.value, colorId };
      if (existingCard) context.library.editCard(existingCard.id, content);
      else context.library.addCard(folderId, content);
      close();
    };

    const remove = () => {
      if (!confirm('Diese Karte löschen?')) return;
      context.library.removeCard(existingCard.id);
      close();
    };

    setTimeout(() => questionInput.focus());
    return [
      sheetHeader(existingCard ? 'Karte bearbeiten' : 'Neue Karte', close),
      el('label', {}, 'Frage', questionInput),
      el('label', {}, 'Antwort', answerInput),
      el(
        'label',
        {},
        'Farbe',
        colorPicker({ selectedId: colorId, inheritLabel: 'Wie Ordner', onChange: (id) => (colorId = id) }),
      ),
      el('button', { className: 'primary-button', onclick: save }, 'Sichern'),
      existingCard && el('button', { className: 'danger-button', onclick: remove }, 'Karte löschen'),
    ];
  });
}

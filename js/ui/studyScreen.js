import { hexOf } from '../domain/palette.js';
import { createStudySession } from '../domain/studyPlan.js';
import { loadStudySettings } from '../storage/studySettingsStorage.js';
import { el } from './dom.js';
import { markButton } from './markButton.js';
import { speakButton } from './speakButton.js';
import { symbolIcon } from './symbolIcon.js';

export function studyScreen(context, route) {
  const { library, go, refresh } = context;
  const { session } = route;
  const leave = () => go(route.backTo);
  const restart = () => go({ ...route, session: createStudySession(library, route.plan) });

  const header = (trailing) =>
    el(
      'header',
      { className: 'top-bar' },
      el('button', { className: 'icon-button', ariaLabel: 'Beenden', onclick: leave }, '✕'),
      el('h1', {}, `${session.masteredCount} / ${session.totalCount}`),
      trailing,
    );

  if (session.isFinished) return finishedView(header(el('span', { className: 'icon-button' })), leave, restart);

  const card = session.currentCard;
  const reveal = () => {
    session.revealAnswer();
    refresh();
  };
  const answer = (isKnown) => {
    if (isKnown) session.markKnown();
    else session.markUnknown();
    refresh();
  };

  return el(
    'main',
    { className: 'screen study', vars: { '--accent': hexOf(library.colorIdOfCard(card)) } },
    header(markButton(library, card)),
    flashcard(card, session.isAnswerRevealed, reveal, loadStudySettings()),
    session.isAnswerRevealed &&
      el(
        'div',
        { className: 'study-actions' },
        el('button', { className: 'danger-button', onclick: () => answer(false) }, 'Nochmal'),
        el('button', { className: 'primary-button', onclick: () => answer(true) }, 'Gewusst'),
      ),
  );
}

function flashcard(card, isAnswerRevealed, reveal, { questionLanguage, answerLanguage }) {
  return el(
    'div',
    { className: 'flashcard', role: 'button', tabIndex: 0, onclick: reveal },
    decorationLayer(card.decorations ?? []),
    el(
      'div',
      { className: 'flashcard-content' },
      spokenLine('flashcard-question', card.question, questionLanguage),
      isAnswerRevealed
        ? [el('hr', { className: 'flashcard-divider' }), spokenLine('flashcard-answer', card.answer, answerLanguage)]
        : el('p', { className: 'flashcard-hint' }, 'Tippen zum Aufdecken'),
    ),
  );
}

function spokenLine(className, text, language) {
  return el(
    'div',
    { className: 'flashcard-line' },
    el('p', { className, 'data-hyphenate-overlong': '' }, text),
    speakButton(text, language),
  );
}

function decorationLayer(decorations) {
  return el(
    'div',
    { className: 'flashcard-decorations', ariaHidden: 'true' },
    decorations.map(({ symbolId, x, y, size, rotation }) =>
      el(
        'span',
        {
          className: 'flashcard-decoration',
          vars: { '--x': `${x}%`, '--y': `${y}%`, '--size': `${size}%`, '--rotation': `${rotation}deg` },
        },
        symbolIcon(symbolId),
      ),
    ),
  );
}

function finishedView(header, leave, restart) {
  return el(
    'main',
    { className: 'screen study' },
    header,
    el('p', { className: 'empty' }, 'Geschafft! 🎉'),
    el(
      'div',
      { className: 'study-actions' },
      el('button', { className: 'secondary-button', onclick: leave }, 'Fertig'),
      el('button', { className: 'primary-button', onclick: restart }, 'Nochmal lernen'),
    ),
  );
}

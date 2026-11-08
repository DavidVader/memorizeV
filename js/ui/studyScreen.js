import { hexOf } from '../domain/palette.js';
import { createStudySession } from '../domain/studyPlan.js';
import { el } from './dom.js';

export function studyScreen(context, route) {
  const { library, go, refresh } = context;
  const { session } = route;
  const leave = () => go(route.backTo);
  const restart = () => go({ ...route, session: createStudySession(library, route.plan) });

  const header = el(
    'header',
    { className: 'top-bar' },
    el('button', { className: 'icon-button', ariaLabel: 'Beenden', onclick: leave }, '✕'),
    el('h1', {}, `${session.masteredCount} / ${session.totalCount}`),
    el('span', { className: 'icon-button' }),
  );

  if (session.isFinished) return finishedView(header, leave, restart);

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
    header,
    el(
      'button',
      { className: 'flashcard', onclick: reveal },
      el('span', { className: 'flashcard-question' }, card.question),
      session.isAnswerRevealed
        ? el('span', { className: 'flashcard-answer' }, card.answer)
        : el('span', { className: 'flashcard-hint' }, 'Tippen zum Aufdecken'),
    ),
    session.isAnswerRevealed &&
      el(
        'div',
        { className: 'study-actions' },
        el('button', { className: 'danger-button', onclick: () => answer(false) }, 'Nochmal'),
        el('button', { className: 'primary-button', onclick: () => answer(true) }, 'Gewusst'),
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

import { SLEEP_PHASES } from '../domain/sleepLearning.js';
import { el } from './dom.js';
import { uiIcon } from './uiIcons.js';

export function sleepScreen(context, route) {
  const stop = () => {
    route.stop();
    context.go(route.backTo);
  };
  const { card, phase } = route.step ?? {};

  return el(
    'main',
    { className: 'sleep' },
    el('div', { className: 'sleep-title' }, uiIcon('moon'), 'Schlaflernen'),
    el(
      'div',
      { className: 'sleep-card' },
      card && el('p', { className: 'sleep-question', 'data-hyphenate-overlong': '' }, card.question),
      card && isAnswerVisible(phase) && el('p', { className: 'sleep-answer', 'data-hyphenate-overlong': '' }, card.answer),
    ),
    el('button', { className: 'secondary-button sleep-stop', onclick: stop }, 'Stoppen'),
  );
}

function isAnswerVisible(phase) {
  return phase === SLEEP_PHASES.answer || phase === SLEEP_PHASES.resting;
}

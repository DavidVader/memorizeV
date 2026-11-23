import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AFTER_ANSWER_PAUSE_MS, createCardCycler, runSleepLoop } from '../js/domain/sleepLearning.js';
import { wait } from '../js/domain/timing.js';

const language = { question: 'de-DE', answer: 'en-US' };

function runForCards(cards, cardLimit) {
  const controller = new AbortController();
  const events = [];
  const nextCard = createCardCycler(() => cards);
  let handedOut = 0;

  const speak = async (text, spokenLanguage) => {
    events.push(`speak:${text}:${spokenLanguage}`);
    return 1000;
  };
  const pause = async (milliseconds) => {
    events.push(`wait:${milliseconds}`);
  };
  const limitedNextCard = () => {
    if (handedOut === cardLimit) {
      controller.abort();
      return undefined;
    }
    handedOut += 1;
    return nextCard();
  };

  return runSleepLoop({ nextCard: limitedNextCard, speak, wait: pause, language, signal: controller.signal }).then(() => events);
}

test('asks, waits twice as long, answers, then waits two seconds', async () => {
  const events = await runForCards([{ question: 'Hund', answer: 'dog' }], 1);
  assert.deepEqual(events, [
    'speak:Hund:de-DE',
    'wait:2000',
    'speak:dog:en-US',
    `wait:${AFTER_ANSWER_PAUSE_MS}`,
  ]);
});

test('continues with the next card and starts over after the last one', async () => {
  const cards = [{ question: 'a', answer: '1' }, { question: 'b', answer: '2' }];
  const events = await runForCards(cards, 3);
  const asked = events.filter((event) => event.startsWith('speak:') && event.endsWith(':de-DE'));
  assert.deepEqual(asked, ['speak:a:de-DE', 'speak:b:de-DE', 'speak:a:de-DE']);
});

test('stops when there are no cards', async () => {
  const controller = new AbortController();
  await runSleepLoop({ nextCard: createCardCycler(() => []), speak: async () => 0, wait: async () => {}, language, signal: controller.signal });
});

test('an abort ends a running wait immediately', async () => {
  const controller = new AbortController();
  const waiting = wait(60_000, controller.signal);
  controller.abort();
  await waiting;
});

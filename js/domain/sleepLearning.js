export const QUESTION_PAUSE_FACTOR = 2;
export const AFTER_ANSWER_PAUSE_MS = 2000;

export const SLEEP_PHASES = Object.freeze({
  question: 'question',
  thinking: 'thinking',
  answer: 'answer',
  resting: 'resting',
});

// Liefert die Karten endlos: ist der Stapel durch, beginnt ein neuer Durchlauf.
export function createCardCycler(createRound) {
  let queue = [];
  return function nextCard() {
    if (queue.length === 0) queue = [...createRound()];
    return queue.shift();
  };
}

// Frage vorlesen, doppelt so lange warten wie das Vorlesen gedauert hat,
// Antwort vorlesen, 2 Sekunden warten, nächste Karte - bis das signal abbricht.
export async function runSleepLoop({ nextCard, speak, wait, language, signal, onStep = () => {} }) {
  while (!signal.aborted) {
    const card = nextCard();
    if (!card) return;

    onStep({ card, phase: SLEEP_PHASES.question });
    const questionDuration = await speak(card.question, language.question, signal);

    onStep({ card, phase: SLEEP_PHASES.thinking });
    await wait(questionDuration * QUESTION_PAUSE_FACTOR, signal);
    if (signal.aborted) return;

    onStep({ card, phase: SLEEP_PHASES.answer });
    await speak(card.answer, language.answer, signal);

    onStep({ card, phase: SLEEP_PHASES.resting });
    await wait(AFTER_ANSWER_PAUSE_MS, signal);
  }
}

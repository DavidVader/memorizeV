import { createCardCycler, runSleepLoop } from '../domain/sleepLearning.js';
import { orderCards } from '../domain/studyOrder.js';
import { selectCards } from '../domain/studyPlan.js';
import { wait } from '../domain/timing.js';
import { speak, stopSpeaking } from './speaker.js';
import { keepScreenAwake } from './wakeLock.js';

export function startSleepSession({ library, plan, settings, onStep }) {
  const controller = new AbortController();
  const nextCard = createCardCycler(() => orderCards(selectCards(library, plan), plan.orderId));
  const language = { question: settings.questionLanguage, answer: settings.answerLanguage };
  let releaseScreen = () => {};

  keepScreenAwake().then((release) => {
    if (controller.signal.aborted) release();
    else releaseScreen = release;
  });
  runSleepLoop({ nextCard, speak, wait, language, signal: controller.signal, onStep });

  return {
    stop() {
      controller.abort();
      stopSpeaking();
      releaseScreen();
    },
  };
}

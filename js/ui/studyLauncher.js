import { createStudySession, planFromSettings } from '../domain/studyPlan.js';
import { isSpeechSupported, prepareSpeech, prepareVoices } from '../speech/speaker.js';
import { startSleepSession } from '../speech/sleepSession.js';
import { loadStudySettings } from '../storage/studySettingsStorage.js';

export function startStudy(context, backTo, overrides = {}) {
  const plan = planFromSettings(context.library, loadStudySettings(), overrides);
  const session = createStudySession(context.library, plan);
  if (session.isFinished) {
    alert('Keine Karten zum Lernen. Prüfe die Lern-Einstellungen (⚙︎).');
    return;
  }
  context.go({ name: 'study', plan, session, backTo });
}

export function openStudySettings(context, backTo) {
  context.go({ name: 'studySettings', settings: loadStudySettings(), backTo });
}

export async function startSleepLearning(context, backTo) {
  prepareSpeech();
  if (!isSpeechSupported()) {
    alert('Dieses Gerät unterstützt keine Sprachausgabe.');
    return;
  }
  const settings = loadStudySettings();
  const plan = planFromSettings(context.library, settings);
  if (createStudySession(context.library, plan).isFinished) {
    alert('Keine Karten zum Lernen. Prüfe die Lern-Einstellungen (⚙︎).');
    return;
  }

  const voicesReady = await prepareVoices([settings.questionLanguage, settings.answerLanguage]);
  if (!voicesReady) return;

  const route = { name: 'sleep', backTo, step: null, stop: () => {} };
  context.go(route);
  const session = startSleepSession({
    library: context.library,
    plan,
    settings,
    onStep: (step) => {
      route.step = step;
      context.refresh();
    },
  });
  route.stop = session.stop;
}

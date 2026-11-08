import { createStudySession, planFromSettings } from '../domain/studyPlan.js';
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

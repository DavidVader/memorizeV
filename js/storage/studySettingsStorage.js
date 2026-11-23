import { DEFAULT_ANSWER_LANGUAGE, DEFAULT_QUESTION_LANGUAGE, languageOrDefault } from '../domain/languages.js';
import { defaultSettings } from '../domain/studyPlan.js';

const STORAGE_KEY = 'memorizeV.studySettings.v1';

export function loadStudySettings(storage = localStorage) {
  try {
    const settings = { ...defaultSettings(), ...JSON.parse(storage.getItem(STORAGE_KEY)) };
    settings.questionLanguage = languageOrDefault(settings.questionLanguage, DEFAULT_QUESTION_LANGUAGE);
    settings.answerLanguage = languageOrDefault(settings.answerLanguage, DEFAULT_ANSWER_LANGUAGE);
    return settings;
  } catch {
    return defaultSettings();
  }
}

export function saveStudySettings(settings, storage = localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Settings are a convenience; the app keeps working without persistence.
  }
}

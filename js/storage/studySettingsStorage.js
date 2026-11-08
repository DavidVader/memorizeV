import { defaultSettings } from '../domain/studyPlan.js';

const STORAGE_KEY = 'memorizeV.studySettings.v1';

export function loadStudySettings(storage = localStorage) {
  try {
    return { ...defaultSettings(), ...JSON.parse(storage.getItem(STORAGE_KEY)) };
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

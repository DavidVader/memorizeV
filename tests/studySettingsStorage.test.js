import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadStudySettings } from '../js/storage/studySettingsStorage.js';

const storageWith = (value) => ({ getItem: () => JSON.stringify(value) });

test('keeps stored languages that are still offered', () => {
  const settings = loadStudySettings(storageWith({ questionLanguage: 'fr-FR', answerLanguage: 'it-IT' }));
  assert.equal(settings.questionLanguage, 'fr-FR');
  assert.equal(settings.answerLanguage, 'it-IT');
});

test('replaces languages that are no longer offered by the defaults', () => {
  const settings = loadStudySettings(storageWith({ questionLanguage: 'ja-JP', answerLanguage: 'ja-JP' }));
  assert.equal(settings.questionLanguage, 'de-DE');
  assert.equal(settings.answerLanguage, 'en-US');
});

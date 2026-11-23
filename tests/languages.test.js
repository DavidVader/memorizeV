import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEFAULT_ANSWER_LANGUAGE, DEFAULT_QUESTION_LANGUAGE, LANGUAGES, voiceOf } from '../js/domain/languages.js';

test('every language has a code, a name and a voice', () => {
  LANGUAGES.forEach((language) => {
    assert.ok(language.code && language.name && language.voice, language.code);
  });
  assert.equal(new Set(LANGUAGES.map((language) => language.code)).size, LANGUAGES.length);
});

test('the default languages are offered', () => {
  const codes = LANGUAGES.map((language) => language.code);
  assert.ok(codes.includes(DEFAULT_QUESTION_LANGUAGE));
  assert.ok(codes.includes(DEFAULT_ANSWER_LANGUAGE));
});

test('maps a language code to its voice, unknown codes fall back', () => {
  assert.equal(voiceOf('de-DE'), 'de');
  assert.equal(voiceOf('unknown'), voiceOf(DEFAULT_ANSWER_LANGUAGE));
});

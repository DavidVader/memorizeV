import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LANGUAGES, languageOf, languageOrDefault } from '../js/domain/languages.js';
import { voiceFileUrls } from '../js/domain/piperVoices.js';
import { MAX_CHUNK_LENGTH, splitIntoChunks } from '../js/domain/textChunks.js';

test('builds the download addresses of a voice', () => {
  const { modelUrl, configUrl } = voiceFileUrls('de_DE-thorsten-medium');
  assert.ok(modelUrl.endsWith('/de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx'));
  assert.equal(configUrl, `${modelUrl}.json`);
});

test('special characters in voice names are encoded', () => {
  assert.ok(voiceFileUrls('pt_PT-tugão-medium').modelUrl.includes('tug%C3%A3o'));
});

test('every language has a unique code and voice', () => {
  const codes = LANGUAGES.map((language) => language.code);
  const voices = LANGUAGES.map((language) => language.voiceId);
  assert.equal(new Set(codes).size, codes.length);
  assert.equal(new Set(voices).size, voices.length);
});

test('unknown languages fall back to a default', () => {
  assert.equal(languageOrDefault('ja-JP', 'de-DE'), 'de-DE');
  assert.equal(languageOrDefault('fr-FR', 'de-DE'), 'fr-FR');
  assert.equal(languageOf('unknown').code, 'en-US');
});

test('short text stays in one chunk, empty text has none', () => {
  assert.deepEqual(splitIntoChunks('  Hallo Welt  '), ['Hallo Welt']);
  assert.deepEqual(splitIntoChunks('   '), []);
});

test('long text is split at sentence ends within the length limit', () => {
  const sentence = `${'wort '.repeat(20)}ende.`;
  const chunks = splitIntoChunks(Array(8).fill(sentence).join(' '));
  assert.ok(chunks.length > 1);
  chunks.forEach((chunk) => assert.ok(chunk.length <= MAX_CHUNK_LENGTH));
});

test('a single endless sentence is split at words', () => {
  const chunks = splitIntoChunks('wort '.repeat(200));
  assert.ok(chunks.length > 1);
  chunks.forEach((chunk) => assert.ok(chunk.length <= MAX_CHUNK_LENGTH));
});

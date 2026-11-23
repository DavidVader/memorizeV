// code: gespeichert in den Einstellungen; voiceId: Piper-Stimme (siehe js/domain/piperVoices.js).
export const LANGUAGES = [
  { code: 'de-DE', name: 'Deutsch', voiceId: 'de_DE-karlsson-low' },
  { code: 'en-US', name: 'Englisch (US)', voiceId: 'en_US-lessac-medium' },
  { code: 'en-GB', name: 'Englisch (UK)', voiceId: 'en_GB-alba-medium' },
  { code: 'fr-FR', name: 'Französisch', voiceId: 'fr_FR-siwis-medium' },
  { code: 'es-ES', name: 'Spanisch', voiceId: 'es_ES-davefx-medium' },
  { code: 'it-IT', name: 'Italienisch', voiceId: 'it_IT-paola-medium' },
  { code: 'pt-PT', name: 'Portugiesisch', voiceId: 'pt_PT-tugão-medium' },
  { code: 'nl-NL', name: 'Niederländisch', voiceId: 'nl_NL-mls-medium' },
  { code: 'pl-PL', name: 'Polnisch', voiceId: 'pl_PL-gosia-medium' },
  { code: 'tr-TR', name: 'Türkisch', voiceId: 'tr_TR-dfki-medium' },
  { code: 'ru-RU', name: 'Russisch', voiceId: 'ru_RU-irina-medium' },
  { code: 'zh-CN', name: 'Chinesisch', voiceId: 'zh_CN-huayan-medium' },
];

export const DEFAULT_QUESTION_LANGUAGE = 'de-DE';
export const DEFAULT_ANSWER_LANGUAGE = 'en-US';

export function isKnownLanguage(languageCode) {
  return LANGUAGES.some((language) => language.code === languageCode);
}

export function languageOrDefault(languageCode, defaultCode) {
  return isKnownLanguage(languageCode) ? languageCode : defaultCode;
}

export function languageOf(languageCode) {
  return LANGUAGES.find((language) => language.code === languageCode) ?? LANGUAGES.find((language) => language.code === DEFAULT_ANSWER_LANGUAGE);
}

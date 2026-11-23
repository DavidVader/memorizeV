// code: gespeichert in den Einstellungen; voice: Stimme der Sprachausgabe (eSpeak NG).
export const LANGUAGES = [
  { code: 'de-DE', name: 'Deutsch', voice: 'de' },
  { code: 'en-US', name: 'Englisch (US)', voice: 'en-us' },
  { code: 'en-GB', name: 'Englisch (UK)', voice: 'en-gb' },
  { code: 'fr-FR', name: 'Französisch', voice: 'fr' },
  { code: 'es-ES', name: 'Spanisch', voice: 'es' },
  { code: 'it-IT', name: 'Italienisch', voice: 'it' },
  { code: 'pt-PT', name: 'Portugiesisch', voice: 'pt-pt' },
  { code: 'nl-NL', name: 'Niederländisch', voice: 'nl' },
  { code: 'pl-PL', name: 'Polnisch', voice: 'pl' },
  { code: 'tr-TR', name: 'Türkisch', voice: 'tr' },
  { code: 'ru-RU', name: 'Russisch', voice: 'ru' },
  { code: 'ja-JP', name: 'Japanisch', voice: 'ja' },
  { code: 'zh-CN', name: 'Chinesisch', voice: 'cmn' },
];

export const DEFAULT_QUESTION_LANGUAGE = 'de-DE';
export const DEFAULT_ANSWER_LANGUAGE = 'en-US';

export function voiceOf(languageCode) {
  const language = LANGUAGES.find((candidate) => candidate.code === languageCode);
  return (language ?? LANGUAGES.find((candidate) => candidate.code === DEFAULT_ANSWER_LANGUAGE)).voice;
}

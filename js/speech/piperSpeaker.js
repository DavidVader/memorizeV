import { languageOf } from '../domain/languages.js';
import { loadVoice, synthesize } from './piperEngine.js';
import { isVoiceStored } from './voiceStore.js';

const FALLBACK_DURATION_MS = 500;
const FAILURE_MESSAGE_MS = 4000;
const PERCENT = 100;

let audioContext = null;
let currentPlayback = null;
let latestRequestId = 0;
let latestFailureId = 0;
const readyVoices = new Set();

// Die Oberfläche hängt hier Rückfragen und Statusmeldungen ein.
let handlers = {
  confirmDownload: async () => true,
  onStatus: () => {},
};

export function configureSpeech(newHandlers) {
  handlers = { ...handlers, ...newHandlers };
}

export function isSpeechSupported() {
  return typeof WebAssembly === 'object' && typeof BigInt64Array === 'function' && Boolean(window.AudioContext ?? window.webkitAudioContext);
}

// Muss direkt in einem Tipp/Klick aufgerufen werden: iOS erlaubt Ton erst nach einer Nutzer-Aktion.
export function prepareSpeech() {
  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
  audioContext ??= new AudioContextClass();
  if (audioContext.state === 'suspended') audioContext.resume();
}

// Stellt die Stimmen bereit (lädt sie bei Bedarf herunter). Liefert false, wenn der Nutzer ablehnt oder es scheitert.
export async function prepareVoices(languageCodes) {
  try {
    for (const languageCode of new Set(languageCodes)) {
      if (!(await ensureVoice(languageCode))) {
        handlers.onStatus(null);
        return false;
      }
    }
    handlers.onStatus(null);
    return true;
  } catch (error) {
    reportFailure(error, 'Die Stimme konnte nicht geladen werden. Internetverbindung nötig?');
    return false;
  }
}

// Liest den Text vor und liefert die Sprechdauer in Millisekunden.
// Ein Abbruch per signal beendet die Wiedergabe sofort.
export async function speak(text, language, signal) {
  prepareSpeech();
  stopSpeaking();
  const requestId = ++latestRequestId;
  if (signal?.aborted) return 0;

  try {
    if (!(await ensureVoice(language))) return 0;
  } catch (error) {
    reportFailure(error, 'Die Stimme konnte nicht geladen werden. Internetverbindung für den ersten Download nötig?');
    return FALLBACK_DURATION_MS;
  }

  try {
    handlers.onStatus(null);
    const { samples, sampleRate } = await synthesize(text, languageOf(language).voiceId);
    if (requestId !== latestRequestId || signal?.aborted) return 0;

    const buffer = audioContext.createBuffer(1, samples.length, sampleRate);
    buffer.copyToChannel(samples, 0);
    await play(buffer, signal);
    return buffer.duration * 1000;
  } catch (error) {
    reportFailure(error, 'Dieser Text konnte nicht vorgelesen werden.');
    return FALLBACK_DURATION_MS;
  }
}

export function stopSpeaking() {
  latestRequestId += 1;
  currentPlayback?.stop();
}

async function ensureVoice(languageCode) {
  const { voiceId, name } = languageOf(languageCode);
  if (readyVoices.has(voiceId)) return true;

  const isDownloaded = await isVoiceStored(voiceId);
  if (!isDownloaded && !(await handlers.confirmDownload(name))) return false;

  handlers.onStatus(isDownloaded ? `Stimme „${name}“ wird vorbereitet …` : `Stimme „${name}“ wird geladen …`);
  await loadVoice(voiceId, (progress) => {
    handlers.onStatus(`Stimme „${name}“ wird geladen … ${Math.round(progress * PERCENT)} %`);
  });
  readyVoices.add(voiceId);
  return true;
}

function reportFailure(error, message) {
  console.error('Sprachausgabe fehlgeschlagen', error);
  handlers.onStatus(message);
  const failureId = ++latestFailureId;
  setTimeout(() => {
    if (failureId === latestFailureId) handlers.onStatus(null);
  }, FAILURE_MESSAGE_MS);
}

function play(buffer, signal) {
  return new Promise((resolve) => {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);

    const finish = () => {
      signal?.removeEventListener('abort', stop);
      if (currentPlayback?.stop === stop) currentPlayback = null;
      resolve();
    };
    const stop = () => {
      source.onended = null;
      try {
        source.stop();
      } catch {
        // Die Wiedergabe war schon beendet.
      }
      finish();
    };

    source.onended = finish;
    signal?.addEventListener('abort', stop, { once: true });
    currentPlayback = { stop };
    source.start();
  });
}

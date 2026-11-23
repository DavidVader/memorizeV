import { voiceOf } from '../domain/languages.js';

// Sprachausgabe mit eSpeak NG (WebAssembly, läuft komplett offline).
// Der Text wird zu einer WAV-Datei berechnet und über Web Audio abgespielt;
// die Länge der Aufnahme ist die genaue Sprechdauer.
const ENGINE_SCRIPT_URL = new URL('../../vendor/espeak-ng/espeak-ng.js', import.meta.url).href;
const ENGINE_WASM_URL = new URL('../../vendor/espeak-ng/espeak-ng.wasm', import.meta.url).href;
const INPUT_FILE = 'input.txt';
const OUTPUT_FILE = 'output.wav';
const WORDS_PER_MINUTE = 150;
const FALLBACK_DURATION_MS = 500;

let audioContext = null;
let enginePromise = null;
let currentPlayback = null;
let latestRequestId = 0;

export function isSpeechSupported() {
  return typeof WebAssembly === 'object' && Boolean(window.AudioContext ?? window.webkitAudioContext);
}

// Muss direkt in einem Tipp/Klick aufgerufen werden: iOS erlaubt Ton erst nach einer Nutzer-Aktion.
export function prepareSpeech() {
  unlockAudio();
  loadEngine().catch(() => {});
}

// Liest den Text vor und liefert die Sprechdauer in Millisekunden.
// Ein Abbruch per signal beendet die Wiedergabe sofort.
export async function speak(text, language, signal) {
  prepareSpeech();
  stopSpeaking();
  const requestId = ++latestRequestId;
  if (signal?.aborted) return 0;

  try {
    const recording = await synthesize(text, voiceOf(language));
    const buffer = await audioContext.decodeAudioData(recording.buffer.slice(recording.byteOffset, recording.byteOffset + recording.byteLength));
    if (requestId !== latestRequestId || signal?.aborted) return 0;
    await play(buffer, signal);
    return buffer.duration * 1000;
  } catch (error) {
    console.error('Sprachausgabe fehlgeschlagen', error);
    return FALLBACK_DURATION_MS;
  }
}

export function stopSpeaking() {
  latestRequestId += 1;
  currentPlayback?.stop();
}

function unlockAudio() {
  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
  audioContext ??= new AudioContextClass();
  if (audioContext.state === 'suspended') audioContext.resume();
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

async function synthesize(text, voice) {
  const { createInstance, wasmModule } = await loadEngine();
  const instance = await createInstance({
    arguments: ['-v', voice, '-s', String(WORDS_PER_MINUTE), '-w', OUTPUT_FILE, '-f', INPUT_FILE],
    preRun: [(engineModule) => engineModule.FS.writeFile(INPUT_FILE, text)],
    instantiateWasm: (imports, receiveInstance) => {
      WebAssembly.instantiate(wasmModule, imports).then((instance) => receiveInstance(instance, wasmModule));
      return {};
    },
    print: () => {},
    printErr: () => {},
  });
  return instance.FS.readFile(OUTPUT_FILE);
}

// Lädt die Engine einmal und übersetzt das WASM nur einmal; jede Ansage nutzt eine frische Instanz.
function loadEngine() {
  enginePromise ??= Promise.all([import(ENGINE_SCRIPT_URL), compileWasm()])
    .then(([engineScript, wasmModule]) => ({ createInstance: engineScript.default, wasmModule }))
    .catch((error) => {
      enginePromise = null;
      throw error;
    });
  return enginePromise;
}

async function compileWasm() {
  const response = await fetch(ENGINE_WASM_URL);
  return WebAssembly.compile(await response.arrayBuffer());
}

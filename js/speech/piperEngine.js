import { phonemesToIds } from '../domain/phonemeIds.js';
import { splitIntoChunks } from '../domain/textChunks.js';
import { loadVoiceFiles } from './voiceStore.js';

// Piper-Sprachausgabe: eSpeak-Phonemizer (WASM) + neuronale Stimme (ONNX Runtime, WASM).
// Alle Dateien liegen unter vendor/piper und laufen offline.
const VENDOR_URL = new URL('../../vendor/piper/', import.meta.url).href;
const MAX_LOADED_VOICES = 2;

let runtimePromise = null;
let queue = Promise.resolve();
const loadedVoices = new Map();

// Lädt Laufzeit und Stimme (falls nötig) und hält sie bereit.
export async function loadVoice(voiceId, onProgress) {
  if (loadedVoices.has(voiceId)) return;
  const runtime = await loadRuntime();
  const { config, modelBytes } = await loadVoiceFiles(voiceId, onProgress);
  const session = await runtime.ort.InferenceSession.create(modelBytes, { executionProviders: ['wasm'] });

  loadedVoices.set(voiceId, { config, session });
  while (loadedVoices.size > MAX_LOADED_VOICES) loadedVoices.delete(loadedVoices.keys().next().value);
}

// Liefert { samples, sampleRate }. Aufrufe laufen nacheinander, da eine Sitzung nur einen Lauf verträgt.
export function synthesize(text, voiceId) {
  const result = queue.then(() => synthesizeAll(text, voiceId));
  queue = result.catch(() => {});
  return result;
}

async function synthesizeAll(text, voiceId) {
  await loadVoice(voiceId);
  const voice = loadedVoices.get(voiceId);
  const runtime = await loadRuntime();

  const parts = [];
  for (const chunk of splitIntoChunks(text)) {
    parts.push(await synthesizeChunk(chunk, voice, runtime));
  }
  return { samples: concatenate(parts), sampleRate: voice.config.audio.sample_rate };
}

async function synthesizeChunk(text, { config, session }, { ort }) {
  const phonemes = await phonemize(text, config.espeak.voice);
  const phonemeIds = phonemesToIds(phonemes, config.phoneme_id_map);
  const { noise_scale: noiseScale, length_scale: lengthScale, noise_w: noiseWidth } = config.inference;
  const feeds = {
    input: new ort.Tensor('int64', BigInt64Array.from(phonemeIds, BigInt), [1, phonemeIds.length]),
    input_lengths: new ort.Tensor('int64', BigInt64Array.from([BigInt(phonemeIds.length)])),
    scales: new ort.Tensor('float32', Float32Array.from([noiseScale, lengthScale, noiseWidth])),
  };
  if (config.num_speakers > 1) feeds.sid = new ort.Tensor('int64', BigInt64Array.from([0n]));

  const { output } = await session.run(feeds);
  return output.data;
}

function phonemize(text, espeakVoice) {
  return new Promise(async (resolve, reject) => {
    try {
      const { createPiperPhonemize, phonemizerWasm, phonemizerData } = await loadRuntime();
      let phonemes = null;
      const module = await createPiperPhonemize({
        print: (line) => (phonemes = JSON.parse(line).phonemes),
        printErr: () => {},
        locateFile: (fileName) => `${VENDOR_URL}${fileName}`,
        getPreloadedPackage: () => phonemizerData,
        instantiateWasm: (imports, receiveInstance) => {
          WebAssembly.instantiate(phonemizerWasm, imports).then((instance) => receiveInstance(instance, phonemizerWasm));
          return {};
        },
      });
      module.callMain(['-l', espeakVoice, '--input', JSON.stringify([{ text }]), '--espeak_data', '/espeak-ng-data']);
      if (phonemes) resolve(phonemes);
      else reject(new Error('Der Text konnte nicht in Laute umgewandelt werden.'));
    } catch (error) {
      reject(error);
    }
  });
}

// Alles, was nur einmal geladen werden muss: ONNX Runtime und Phonemizer.
function loadRuntime() {
  runtimePromise ??= (async () => {
    const [ortModule, phonemizerModule, phonemizerWasm, phonemizerData] = await Promise.all([
      import(`${VENDOR_URL}ort.wasm.min.js`),
      import(`${VENDOR_URL}piper-phonemize.js`),
      fetchBytes(`${VENDOR_URL}piper_phonemize.wasm`).then((bytes) => WebAssembly.compile(bytes)),
      fetchBytes(`${VENDOR_URL}piper_phonemize.data`),
    ]);
    const ort = ortModule.default ?? ortModule;
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.proxy = false;
    ort.env.wasm.wasmPaths = VENDOR_URL;
    return { ort, createPiperPhonemize: phonemizerModule.createPiperPhonemize, phonemizerWasm, phonemizerData };
  })().catch((error) => {
    runtimePromise = null;
    throw error;
  });
  return runtimePromise;
}

async function fetchBytes(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Datei fehlt: ${url}`);
  return response.arrayBuffer();
}

function concatenate(parts) {
  const merged = new Float32Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  parts.forEach((part) => {
    merged.set(part, offset);
    offset += part.length;
  });
  return merged;
}

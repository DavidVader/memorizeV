import { APPROXIMATE_VOICE_SIZE_MB, voiceFileUrls } from '../domain/piperVoices.js';

// Heruntergeladene Stimmen liegen im Cache des Browsers und funktionieren danach offline.
export const VOICE_CACHE_NAME = 'memorizev-voices';

const BYTES_PER_MEGABYTE = 1024 * 1024;

export async function isVoiceStored(voiceId) {
  if (typeof caches === 'undefined') return false;
  const { modelUrl, configUrl } = voiceFileUrls(voiceId);
  const cache = await caches.open(VOICE_CACHE_NAME);
  const [model, config] = await Promise.all([cache.match(modelUrl), cache.match(configUrl)]);
  return Boolean(model && config);
}

// Liefert { config, modelBytes }; onProgress bekommt einen Wert von 0 bis 1.
export async function loadVoiceFiles(voiceId, onProgress = () => {}) {
  const { modelUrl, configUrl } = voiceFileUrls(voiceId);
  const configBytes = await fetchStored(configUrl);
  const modelBytes = await fetchStored(modelUrl, onProgress);
  return { config: JSON.parse(new TextDecoder().decode(configBytes)), modelBytes };
}

async function fetchStored(url, onProgress = () => {}) {
  const cache = typeof caches === 'undefined' ? null : await caches.open(VOICE_CACHE_NAME);
  const stored = await cache?.match(url);
  if (stored) return stored.arrayBuffer();

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download fehlgeschlagen (${response.status}): ${url}`);
  const bytes = await readWithProgress(response, onProgress);
  await cache?.put(url, new Response(bytes));
  return bytes;
}

async function readWithProgress(response, onProgress) {
  const total = Number(response.headers.get('content-length')) || APPROXIMATE_VOICE_SIZE_MB * BYTES_PER_MEGABYTE;
  const reader = response.body.getReader();
  const parts = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value);
    received += value.length;
    onProgress(Math.min(received / total, 1));
  }

  const bytes = new Uint8Array(received);
  let offset = 0;
  parts.forEach((part) => {
    bytes.set(part, offset);
    offset += part.length;
  });
  return bytes.buffer;
}

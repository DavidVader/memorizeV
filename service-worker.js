const CACHE_NAME = 'memorizev-v16';
const VOICE_CACHE_NAME = 'memorizev-voices';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './js/main.js',
  './vendor/piper/ort.wasm.min.js',
  './vendor/piper/ort-wasm-simd.wasm',
  './vendor/piper/piper-phonemize.js',
  './vendor/piper/piper_phonemize.wasm',
  './vendor/piper/piper_phonemize.data',
  './js/domain/cardDecoration.js',
  './js/domain/identity.js',
  './js/domain/languages.js',
  './js/domain/library.js',
  './js/domain/phonemeIds.js',
  './js/domain/piperVoices.js',
  './js/domain/palette.js',
  './js/domain/sleepLearning.js',
  './js/domain/studyOrder.js',
  './js/domain/studyPlan.js',
  './js/domain/studySession.js',
  './js/domain/symbols.js',
  './js/domain/textChunks.js',
  './js/domain/timing.js',
  './js/ui/studySettingsScreen.js',
  './js/speech/piperEngine.js',
  './js/speech/sleepSession.js',
  './js/speech/instantSpeaker.js',
  './js/speech/piperSpeaker.js',
  './js/speech/voiceStore.js',
  './js/speech/wakeLock.js',
  './js/files/cardTextCodec.js',
  './js/files/fileTransfer.js',
  './js/files/transferActions.js',
  './js/storage/libraryStorage.js',
  './js/storage/studySettingsStorage.js',
  './js/ui/addItemSheet.js',
  './js/ui/app.js',
  './js/ui/cardSheet.js',
  './js/ui/colorPicker.js',
  './js/ui/dom.js',
  './js/ui/dragAndDrop.js',
  './js/ui/dragMoves.js',
  './js/ui/folderScreen.js',
  './js/ui/folderSheet.js',
  './js/ui/folderIcon.js',
  './js/ui/folderList.js',
  './js/ui/routes.js',
  './js/ui/foldersScreen.js',
  './js/ui/studyLauncher.js',
  './js/ui/markButton.js',
  './js/ui/overlongWords.js',
  './js/ui/sheet.js',
  './js/ui/studyScreen.js',
  './js/ui/sleepScreen.js',
  './js/ui/speechStatus.js',
  './js/ui/speakButton.js',
  './js/ui/symbolIcon.js',
  './js/ui/symbolIcons.js',
  './js/ui/symbolPicker.js',
  './js/ui/uiIcons.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(deleteOutdatedCaches().then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(networkFirstWithCacheFallback(event.request));
});

async function deleteOutdatedCaches() {
  const names = await caches.keys();
  await Promise.all(names.filter((name) => name !== CACHE_NAME && name !== VOICE_CACHE_NAME).map((name) => caches.delete(name)));
}

async function networkFirstWithCacheFallback(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request, { cache: 'no-cache' });
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request, { ignoreSearch: true })) ?? Response.error();
  }
}

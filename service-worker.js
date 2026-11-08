const CACHE_NAME = 'memorizev-v2';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './js/main.js',
  './js/domain/identity.js',
  './js/domain/library.js',
  './js/domain/palette.js',
  './js/domain/studyOrder.js',
  './js/domain/studyPlan.js',
  './js/domain/studySession.js',
  './js/ui/studySetupScreen.js',
  './js/files/cardTextCodec.js',
  './js/files/fileTransfer.js',
  './js/files/transferActions.js',
  './js/storage/libraryStorage.js',
  './js/ui/app.js',
  './js/ui/cardSheet.js',
  './js/ui/colorPicker.js',
  './js/ui/dom.js',
  './js/ui/folderScreen.js',
  './js/ui/folderSheet.js',
  './js/ui/foldersScreen.js',
  './js/ui/sheet.js',
  './js/ui/studyScreen.js',
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
  event.respondWith(networkFirstWithCacheFallback(event.request));
});

async function deleteOutdatedCaches() {
  const names = await caches.keys();
  await Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)));
}

async function networkFirstWithCacheFallback(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request, { ignoreSearch: true })) ?? Response.error();
  }
}

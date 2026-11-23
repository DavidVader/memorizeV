import { loadLibrary, saveOnEveryChange } from './storage/libraryStorage.js';
import { startApp } from './ui/app.js';

const library = loadLibrary();
saveOnEveryChange(library);
startApp(document.getElementById('app'), library);

if ('serviceWorker' in navigator) {
  reloadWhenUpdatedWorkerTakesOver();
  navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' }).catch(() => {});
}

function reloadWhenUpdatedWorkerTakesOver() {
  const hadWorker = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadWorker) location.reload();
  });
}

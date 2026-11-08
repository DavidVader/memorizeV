import { loadLibrary, saveOnEveryChange } from './storage/libraryStorage.js';
import { startApp } from './ui/app.js';

const library = loadLibrary();
saveOnEveryChange(library);
startApp(document.getElementById('app'), library);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch(() => {});
}

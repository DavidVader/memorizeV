import { APPROXIMATE_VOICE_SIZE_MB } from '../domain/piperVoices.js';
import { configureSpeech } from '../speech/speaker.js';
import { el } from './dom.js';

export function installSpeechUi() {
  const statusBar = el('div', { className: 'speech-status', role: 'status', hidden: true });
  document.body.append(statusBar);

  configureSpeech({
    confirmDownload: async (languageName) =>
      confirm(
        `Für die Sprachausgabe „${languageName}“ wird einmalig eine Stimme geladen (ca. ${APPROXIMATE_VOICE_SIZE_MB} MB). ` +
          'Danach funktioniert sie offline. Jetzt laden?',
      ),
    onStatus: (message) => {
      statusBar.textContent = message ?? '';
      statusBar.hidden = !message;
    },
  });
}

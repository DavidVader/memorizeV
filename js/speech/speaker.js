const MIN_SPEECH_MS = 500;
const SAFETY_BASE_MS = 5000;
const SAFETY_MS_PER_CHARACTER = 400;

// Wird gehalten, damit der Browser die laufende Ausgabe nicht vorzeitig aufräumt.
let activeUtterance = null;

export function isSpeechSupported() {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

// Liest den Text vor und liefert die Sprechdauer in Millisekunden.
// Der Abbruch per signal beendet die Wiedergabe sofort.
export function speak(text, language, signal) {
  return new Promise((resolve) => {
    if (!isSpeechSupported() || signal?.aborted) return resolve(0);
    if (speechSynthesis.speaking) speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    activeUtterance = utterance;
    let startedAt = performance.now();
    let safetyTimer;

    const finish = () => {
      clearTimeout(safetyTimer);
      signal?.removeEventListener('abort', abort);
      resolve(Math.max(performance.now() - startedAt, MIN_SPEECH_MS));
    };
    const abort = () => {
      speechSynthesis.cancel();
      finish();
    };

    utterance.onstart = () => (startedAt = performance.now());
    utterance.onend = finish;
    utterance.onerror = finish;
    signal?.addEventListener('abort', abort, { once: true });
    // Falls ein Gerät keine Ereignisse meldet, bleibt die Wiedergabe nicht hängen.
    safetyTimer = setTimeout(finish, SAFETY_BASE_MS + text.length * SAFETY_MS_PER_CHARACTER);
    speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if (isSpeechSupported()) speechSynthesis.cancel();
  activeUtterance = null;
}

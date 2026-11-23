const VOICES_BASE_URL = 'https://huggingface.co/rhasspy/piper-voices/resolve/main';

export const APPROXIMATE_VOICE_SIZE_MB = 65;

// Stimmen heißen "<Sprache>_<Land>-<Name>-<Qualität>", z. B. "de_DE-thorsten-medium".
export function voiceFileUrls(voiceId) {
  const [locale, name, quality] = voiceId.split('-');
  const language = locale.split('_')[0];
  const baseUrl = `${VOICES_BASE_URL}/${language}/${locale}/${encodeURIComponent(name)}/${quality}/${encodeURIComponent(voiceId)}`;
  return { modelUrl: `${baseUrl}.onnx`, configUrl: `${baseUrl}.onnx.json` };
}

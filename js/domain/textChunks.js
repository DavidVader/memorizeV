export const MAX_CHUNK_LENGTH = 300;

// Teilt lange Texte an Satzenden (zur Not an Wörtern), damit die Sprachausgabe nicht zu lange rechnet.
export function splitIntoChunks(text, maxLength = MAX_CHUNK_LENGTH) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.length <= maxLength) return [trimmed];

  const sentences = trimmed.match(/[^.!?…\n]+[.!?…]*\s*/g) ?? [trimmed];
  const chunks = [];
  let current = '';

  const pushCurrent = () => {
    if (current.trim()) chunks.push(current.trim());
    current = '';
  };

  sentences.flatMap((sentence) => splitLongSentence(sentence, maxLength)).forEach((sentence) => {
    if ((current + sentence).length > maxLength) pushCurrent();
    current += sentence;
  });
  pushCurrent();
  return chunks;
}

function splitLongSentence(sentence, maxLength) {
  if (sentence.length <= maxLength) return [sentence];
  const pieces = [];
  let piece = '';
  sentence.split(/\s+/).forEach((word) => {
    if (piece && `${piece} ${word}`.length > maxLength) {
      pieces.push(`${piece} `);
      piece = word;
    } else {
      piece = piece ? `${piece} ${word}` : word;
    }
  });
  if (piece) pieces.push(piece);
  return pieces;
}

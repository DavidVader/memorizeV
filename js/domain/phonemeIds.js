const START = '^';
const END = '$';
const PAD = '_';

// Übersetzt Laute in die Nummern, die die Stimme kennt (phoneme_id_map aus ihrer Konfiguration).
// Jede Stimme hat ihre eigene Tabelle; Laute, die sie nicht kennt, werden übersprungen.
export function phonemesToIds(phonemes, phonemeIdMap) {
  const symbols = [...phonemes.join('').normalize('NFC')];
  const ids = [...phonemeIdMap[START], ...phonemeIdMap[PAD]];

  symbols.forEach((symbol) => {
    const symbolIds = phonemeIdMap[symbol];
    if (!symbolIds) return;
    ids.push(...symbolIds, ...phonemeIdMap[PAD]);
  });

  ids.push(...phonemeIdMap[END]);
  return ids;
}

import { parseCards, serializeCards } from './cardTextCodec.js';
import { exportTextFile, nameWithoutExtension, pickTextFiles, readText } from './fileTransfer.js';

const FORMAT_HINT = 'Format: eine Karte pro Zeile, "Frage;Antwort" oder "Frage<Tab>Antwort".';

export async function importFilesAsFolders(library) {
  const files = await pickTextFiles();
  const report = [];
  for (const file of files) {
    const cards = parseCards(await readText(file));
    if (cards.length === 0) {
      report.push(`${file.name}: keine Karten gefunden`);
      continue;
    }
    const folder = library.addFolder({ name: nameWithoutExtension(file) });
    library.addCards(folder.id, cards);
    report.push(`${file.name}: ${cards.length} Karten`);
  }
  return summarize(report);
}

export async function importFilesIntoFolder(library, folderId) {
  const files = await pickTextFiles();
  const report = [];
  for (const file of files) {
    const cards = parseCards(await readText(file));
    library.addCards(folderId, cards);
    report.push(`${file.name}: ${cards.length} Karten`);
  }
  return summarize(report);
}

export function exportFolder(library, folderId) {
  const folder = library.folder(folderId);
  const text = serializeCards(library.cardsIn(folderId));
  return exportTextFile(folder.name, text);
}

function summarize(report) {
  if (report.length === 0) return '';
  const hasCards = report.some((line) => !line.endsWith('keine Karten gefunden'));
  return hasCards ? report.join('\n') : `${report.join('\n')}\n\n${FORMAT_HINT}`;
}

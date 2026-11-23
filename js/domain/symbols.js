// Katalog der wählbaren Symbole. Die Zeichnungen stehen in js/ui/symbolIcons.js.
export const SYMBOL_GROUPS = [
  { id: 'shapes', name: 'Formen' },
  { id: 'school', name: 'Schule' },
  { id: 'jobs', name: 'Berufe' },
  { id: 'objects', name: 'Objekte' },
];

export const SHAPES_GROUP_ID = 'shapes';
export const DEFAULT_SYMBOL_ID = 'circle';

export const SYMBOLS = [
  { id: 'circle', name: 'Kreis', group: 'shapes' },
  { id: 'triangle', name: 'Dreieck', group: 'shapes' },
  { id: 'square', name: 'Viereck', group: 'shapes' },
  { id: 'diamond', name: 'Raute', group: 'shapes' },
  { id: 'pentagon', name: 'Fünfeck', group: 'shapes' },
  { id: 'hexagon', name: 'Sechseck', group: 'shapes' },
  { id: 'heptagon', name: 'Siebeneck', group: 'shapes' },
  { id: 'octagon', name: 'Achteck', group: 'shapes' },
  { id: 'graduation-cap', name: 'Abschluss', group: 'school' },
  { id: 'book', name: 'Buch', group: 'school' },
  { id: 'book-open', name: 'Offenes Buch', group: 'school' },
  { id: 'pencil', name: 'Stift', group: 'school' },
  { id: 'ruler', name: 'Lineal', group: 'school' },
  { id: 'calculator', name: 'Taschenrechner', group: 'school' },
  { id: 'backpack', name: 'Rucksack', group: 'school' },
  { id: 'school', name: 'Schule', group: 'school' },
  { id: 'library', name: 'Bibliothek', group: 'school' },
  { id: 'notebook-pen', name: 'Notizbuch', group: 'school' },
  { id: 'flask-conical', name: 'Chemie', group: 'school' },
  { id: 'atom', name: 'Physik', group: 'school' },
  { id: 'globe', name: 'Erde', group: 'school' },
  { id: 'languages', name: 'Sprachen', group: 'school' },
  { id: 'brain', name: 'Gehirn', group: 'school' },
  { id: 'stethoscope', name: 'Arzt', group: 'jobs' },
  { id: 'hammer', name: 'Handwerk', group: 'jobs' },
  { id: 'wrench', name: 'Mechaniker', group: 'jobs' },
  { id: 'chef-hat', name: 'Koch', group: 'jobs' },
  { id: 'briefcase', name: 'Büro', group: 'jobs' },
  { id: 'scale', name: 'Justiz', group: 'jobs' },
  { id: 'plane', name: 'Pilot', group: 'jobs' },
  { id: 'truck', name: 'Fahrer', group: 'jobs' },
  { id: 'paintbrush', name: 'Maler', group: 'jobs' },
  { id: 'camera', name: 'Fotograf', group: 'jobs' },
  { id: 'music', name: 'Musiker', group: 'jobs' },
  { id: 'code', name: 'Programmierer', group: 'jobs' },
  { id: 'microscope', name: 'Forscher', group: 'jobs' },
  { id: 'tractor', name: 'Landwirt', group: 'jobs' },
  { id: 'scissors', name: 'Friseur', group: 'jobs' },
  { id: 'lightbulb', name: 'Glühbirne', group: 'objects' },
  { id: 'key', name: 'Schlüssel', group: 'objects' },
  { id: 'house', name: 'Haus', group: 'objects' },
  { id: 'car', name: 'Auto', group: 'objects' },
  { id: 'bike', name: 'Fahrrad', group: 'objects' },
  { id: 'tree-pine', name: 'Baum', group: 'objects' },
  { id: 'flower-2', name: 'Blume', group: 'objects' },
  { id: 'sun', name: 'Sonne', group: 'objects' },
  { id: 'moon', name: 'Mond', group: 'objects' },
  { id: 'cloud', name: 'Wolke', group: 'objects' },
  { id: 'umbrella', name: 'Schirm', group: 'objects' },
  { id: 'coffee', name: 'Kaffee', group: 'objects' },
  { id: 'utensils', name: 'Besteck', group: 'objects' },
  { id: 'gift', name: 'Geschenk', group: 'objects' },
  { id: 'clock', name: 'Uhr', group: 'objects' },
  { id: 'bell', name: 'Glocke', group: 'objects' },
  { id: 'map-pin', name: 'Ort', group: 'objects' },
  { id: 'rocket', name: 'Rakete', group: 'objects' },
  { id: 'gamepad-2', name: 'Spiel', group: 'objects' },
  { id: 'palette', name: 'Farben', group: 'objects' },
  { id: 'heart', name: 'Herz', group: 'objects' },
  { id: 'trophy', name: 'Pokal', group: 'objects' },
  { id: 'anchor', name: 'Anker', group: 'objects' },
  { id: 'dumbbell', name: 'Hantel', group: 'objects' },
];

export function symbolsInGroup(groupId) {
  return SYMBOLS.filter((symbol) => symbol.group === groupId);
}

export function symbolOf(symbolId) {
  return SYMBOLS.find((symbol) => symbol.id === symbolId) ?? SYMBOLS.find((symbol) => symbol.id === DEFAULT_SYMBOL_ID);
}

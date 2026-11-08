export const PALETTE = [
  { id: 'red', name: 'Rot', hex: '#ff453a' },
  { id: 'orange', name: 'Orange', hex: '#ff9f0a' },
  { id: 'yellow', name: 'Gelb', hex: '#ffd60a' },
  { id: 'green', name: 'Grün', hex: '#30d158' },
  { id: 'teal', name: 'Türkis', hex: '#40c8e0' },
  { id: 'blue', name: 'Blau', hex: '#0a84ff' },
  { id: 'purple', name: 'Lila', hex: '#bf5af2' },
  { id: 'pink', name: 'Pink', hex: '#ff375f' },
  { id: 'gray', name: 'Grau', hex: '#8e8e93' },
];

export const DEFAULT_COLOR_ID = 'blue';

export function hexOf(colorId) {
  const color = PALETTE.find((candidate) => candidate.id === colorId);
  return (color ?? PALETTE.find((candidate) => candidate.id === DEFAULT_COLOR_ID)).hex;
}

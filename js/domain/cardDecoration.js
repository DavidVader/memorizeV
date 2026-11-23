import { SYMBOLS } from './symbols.js';

export const MAX_DECORATIONS = 3;

const POSITION_RANGE_PERCENT = { min: 5, max: 95 };
const SIZE_RANGE_PERCENT = { min: 20, max: 45 };
const ROTATION_RANGE_DEGREES = { min: -30, max: 30 };

export function createDecorations(random = Math.random) {
  const count = Math.floor(random() * (MAX_DECORATIONS + 1));
  return Array.from({ length: count }, () => createDecoration(random));
}

function createDecoration(random) {
  return {
    symbolId: SYMBOLS[Math.floor(random() * SYMBOLS.length)].id,
    x: randomBetween(random, POSITION_RANGE_PERCENT),
    y: randomBetween(random, POSITION_RANGE_PERCENT),
    size: randomBetween(random, SIZE_RANGE_PERCENT),
    rotation: randomBetween(random, ROTATION_RANGE_DEGREES),
  };
}

function randomBetween(random, { min, max }) {
  return Math.round(min + random() * (max - min));
}

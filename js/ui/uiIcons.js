import { el } from './dom.js';

// Lucide-Icons (https://lucide.dev, ISC-Lizenz), viewBox 0 0 24 24.
const UI_ICON_MARKUP = {
  speaker:
    '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><path d="M16 9a5 5 0 0 1 0 6" /><path d="M19.364 18.364a9 9 0 0 0 0-12.728" />',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />',
};

export function uiIcon(name) {
  return el('span', {
    className: 'ui-icon',
    innerHTML: `<svg viewBox="0 0 24 24" aria-hidden="true">${UI_ICON_MARKUP[name]}</svg>`,
  });
}

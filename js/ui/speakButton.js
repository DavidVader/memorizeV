import { speak } from '../speech/instantSpeaker.js';
import { el } from './dom.js';
import { uiIcon } from './uiIcons.js';

export function speakButton(text, language) {
  return el(
    'button',
    {
      type: 'button',
      className: 'speak-button',
      ariaLabel: 'Vorlesen',
      onclick: (event) => {
        event.stopPropagation();
        speak(text, language);
      },
    },
    uiIcon('speaker'),
  );
}

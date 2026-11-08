const SIZE_STEPS = [
  { maxLength: 40, className: 'text-large' },
  { maxLength: 120, className: 'text-medium' },
  { maxLength: 300, className: 'text-small' },
];

export function textSizeClass(text) {
  const step = SIZE_STEPS.find((candidate) => text.length <= candidate.maxLength);
  return step ? step.className : 'text-tiny';
}

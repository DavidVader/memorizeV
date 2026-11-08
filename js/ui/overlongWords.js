const SOFT_HYPHEN = '­';
const BREAK_CHUNK_SIZE = 3;

export function hyphenateOverlongWords(element) {
  const availableWidth = element.parentElement.clientWidth;
  if (!availableWidth) return;

  const measure = createMeasurer(element);
  element.textContent = element.textContent.replace(/\S+/g, (word) =>
    measure(word) > availableWidth ? withSoftHyphens(word) : word,
  );
}

function createMeasurer(element) {
  const context = document.createElement('canvas').getContext('2d');
  const style = getComputedStyle(element);
  context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  return (word) => context.measureText(word).width;
}

function withSoftHyphens(word) {
  const chunks = word.match(new RegExp(`.{1,${BREAK_CHUNK_SIZE}}`, 'gu'));
  return chunks.join(SOFT_HYPHEN);
}

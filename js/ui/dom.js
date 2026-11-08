export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([name, value]) => applyProp(node, name, value));
  node.append(...children.flat().filter((child) => child !== null && child !== undefined && child !== false));
  return node;
}

export function growWithContent(textarea) {
  const resize = () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  textarea.addEventListener('input', resize);
  setTimeout(resize);
  return textarea;
}

function applyProp(node, name, value) {
  if (name.startsWith('on')) {
    node.addEventListener(name.slice(2).toLowerCase(), value);
  } else if (name === 'vars') {
    Object.entries(value).forEach(([variable, content]) => node.style.setProperty(variable, content));
  } else if (name in node) {
    node[name] = value;
  } else {
    node.setAttribute(name, value);
  }
}

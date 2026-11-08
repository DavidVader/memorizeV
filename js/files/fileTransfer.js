export function pickTextFiles() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,text/plain';
    input.multiple = true;
    input.addEventListener('change', () => resolve([...input.files]));
    input.addEventListener('cancel', () => resolve([]));
    input.click();
  });
}

export function readText(file) {
  return file.text();
}

export function nameWithoutExtension(file) {
  return file.name.replace(/\.[^.]+$/, '');
}

export async function exportTextFile(baseName, text) {
  const file = new File([text], `${safeFileName(baseName)}.txt`, { type: 'text/plain' });
  const shared = await tryShare(file);
  if (!shared) download(file);
}

function safeFileName(name) {
  return name.replace(/[\\/:*?"<>|]+/g, '_').trim() || 'memorizeV';
}

async function tryShare(file) {
  if (!navigator.canShare?.({ files: [file] })) return false;
  try {
    await navigator.share({ files: [file], title: file.name });
    return true;
  } catch (error) {
    return error.name === 'AbortError';
  }
}

function download(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

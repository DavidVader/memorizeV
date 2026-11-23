import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT) || 8080;
const PROJECT_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
};

const server = createServer(async (request, response) => {
  const requestedPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const filePath = join(PROJECT_ROOT, normalize(requestedPath === '/' ? '/index.html' : requestedPath));

  if (!filePath.startsWith(PROJECT_ROOT)) return respond(response, 403, 'Forbidden');

  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': CONTENT_TYPES[extname(filePath)] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    response.end(content);
  } catch {
    respond(response, 404, 'Not found');
  }
});

server.on('error', (error) => {
  const reason = error.code === 'EADDRINUSE' ? `Port ${PORT} ist belegt (PORT=8081 npm start probieren)` : error.message;
  console.error(`Server konnte nicht starten: ${reason}`);
  process.exit(1);
});

server.listen(PORT, () => console.log(`memorizeV läuft auf http://localhost:${PORT}`));

function respond(response, status, text) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(text);
}

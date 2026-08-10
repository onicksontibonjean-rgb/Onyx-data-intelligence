import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.argv[2] || '.');
const port = Number(process.argv[3] || 5173);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  try {
    const rawPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const relative = rawPath === '/' ? 'index.html' : rawPath.replace(/^\/+/, '');
    const filePath = normalize(join(root, relative));
    if (!filePath.startsWith(root)) throw new Error('Invalid path');

    const info = await stat(filePath);
    const finalPath = info.isDirectory() ? join(filePath, 'index.html') : filePath;
    const body = await readFile(finalPath);
    res.writeHead(200, { 'Content-Type': mime[extname(finalPath).toLowerCase()] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 — fichier introuvable');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Onyx disponible sur http://127.0.0.1:${port}`);
  console.log(`Racine servie : ${root}`);
});

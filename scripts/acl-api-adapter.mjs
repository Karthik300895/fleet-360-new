import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const projectRoot = path.resolve(__dirname, '..');

/**
 * Read JSON body and attach to req for Vercel-style api/*.js handlers.
 */
export async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export function createApiRequest(incoming, urlPath, query = '') {
  const url = `http://127.0.0.1${urlPath}${query ? `?${query}` : ''}`;
  return Object.assign(incoming, { url });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

export function tryServeStatic(distRoot, urlPath, res) {
  let rel = urlPath === '/' ? '/index.html' : urlPath;
  rel = rel.split('?')[0];
  const filePath = path.join(distRoot, path.normalize(rel).replace(/^(\.\.(\/|\\|$))+/, ''));
  if (!filePath.startsWith(distRoot)) {
    res.writeHead(403);
    res.end('Forbidden');
    return true;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    const indexFallback = path.join(distRoot, 'index.html');
    if (fs.existsSync(indexFallback) && !rel.includes('.')) {
      const html = fs.readFileSync(indexFallback);
      res.writeHead(200, { 'Content-Type': MIME['.html'] });
      res.end(html);
      return true;
    }
    return false;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  res.end(fs.readFileSync(filePath));
  return true;
}

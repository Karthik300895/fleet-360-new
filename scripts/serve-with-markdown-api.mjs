/**
 * Self-hosted server: static dist + /api/save-markdown & /api/list-markdown-files
 *
 * Usage on velocityone (repo checkout):
 *   ACL_LOCAL_SERVER=1 ACL_LOCAL_GIT_AUTO_PUSH=1 node scripts/serve-with-markdown-api.mjs
 *
 * Env:
 *   PORT (default 3000)
 *   ACL_REPO_ROOT — git checkout root (default: repo root)
 *   ACL_LOCAL_SERVER=1 — write files on disk instead of GitHub API when possible
 *   ACL_LOCAL_GIT_AUTO_PUSH=1 — git add / commit / push after each save
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  createApiRequest,
  projectRoot,
  readJsonBody,
  tryServeStatic,
} from './acl-api-adapter.mjs';

process.env.ACL_LOCAL_SERVER = process.env.ACL_LOCAL_SERVER || '1';
process.env.ACL_LOCAL_GIT_AUTO_PUSH = process.env.ACL_LOCAL_GIT_AUTO_PUSH || '1';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const repoRoot = process.env.ACL_REPO_ROOT
  ? path.resolve(process.env.ACL_REPO_ROOT)
  : projectRoot;

loadEnvFile(path.join(repoRoot, '.env'));

const distRoot = path.join(repoRoot, 'dist');
const port = Number(process.env.PORT || 3000);

const saveHandler = (
  await import(pathToFileURL(path.join(projectRoot, 'api/save-markdown.js')).href)
).default;
const listHandler = (
  await import(pathToFileURL(path.join(projectRoot, 'api/list-markdown-files.js')).href)
).default;

process.chdir(repoRoot);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (req.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-GitHub-Token',
    });
    res.end();
    return;
  }

  if (pathname === '/api/save-markdown' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const apiReq = createApiRequest(req, pathname);
      apiReq.body = body;
      await saveHandler(apiReq, res);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        ok: true,
        markdownApi: true,
        repoRoot,
        distRoot,
        localGitAutoPush: process.env.ACL_LOCAL_GIT_AUTO_PUSH,
      }),
    );
    return;
  }

  if (pathname === '/api/list-markdown-files' && req.method === 'GET') {
    try {
      const apiReq = createApiRequest(req, pathname, url.searchParams.toString());
      await listHandler(apiReq, res);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ files: [], error: err.message }));
    }
    return;
  }

  if (pathname === '/markdown' || pathname === '/markdown/') {
    if (tryServeStatic(distRoot, '/markdown.html', res)) {
      return;
    }
  }

  if (pathname === '/package.json') {
    const pkgPath = path.join(repoRoot, 'package.json');
    if (fs.existsSync(pkgPath)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(fs.readFileSync(pkgPath, 'utf8'));
      return;
    }
  }

  if (tryServeStatic(distRoot, pathname, res)) {
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found', path: pathname }));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`[ACL] Markdown API + static dist on http://0.0.0.0:${port}`);
  console.log(`[ACL] Repo root: ${repoRoot}`);
  console.log(`[ACL] Local git auto-push: ${process.env.ACL_LOCAL_GIT_AUTO_PUSH}`);
});

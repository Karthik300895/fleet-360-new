import type { Plugin, ResolvedConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const ACL_ROOT = '_acl-output';

type AclDocFile = {
  path: string;
  name: string;
  folder: string;
  url: string;
  label: string;
  createdAt: string;
  createdAtMs: number;
};

function createdAtMs(stat: fs.Stats): number {
  // Prefer filesystem birthtime (creation). Fall back when unsupported.
  const candidates = [stat.birthtimeMs, stat.ctimeMs, stat.mtimeMs];
  return candidates.find((ms) => Number.isFinite(ms) && ms > 0) ?? 0;
}

function collectMarkdownFiles(dir: string, baseDir: string): AclDocFile[] {
  if (!fs.existsSync(dir)) return [];

  const results: AclDocFile[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMarkdownFiles(full, baseDir));
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    // Skip ACL internal memlogs
    if (entry.name === '.memlog.md') continue;

    const relPath = path.relative(baseDir, full).replace(/\\/g, '/');
    const parts = relPath.split('/');
    const name = parts[parts.length - 1];
    const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : '';
    const ms = createdAtMs(fs.statSync(full));

    results.push({
      path: relPath,
      name,
      folder,
      url: `/${ACL_ROOT}/${relPath}`,
      label: folder ? `${folder}/${name}` : name,
      createdAt: new Date(ms).toISOString(),
      createdAtMs: ms,
    });
  }
  return results;
}

function listAclDocs(projectRoot: string): AclDocFile[] {
  const aclDir = path.join(projectRoot, ACL_ROOT);
  const files = collectMarkdownFiles(aclDir, aclDir);
  // Oldest created first (creation timeline)
  files.sort((a, b) => {
    const diff = a.createdAtMs - b.createdAtMs;
    if (diff !== 0) return diff;
    return a.path.localeCompare(b.path);
  });
  return files;
}

function sendJson(res: import('http').ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function resolveAclFile(projectRoot: string, urlPath: string): string | null {
  const prefix = `/${ACL_ROOT}/`;
  if (!urlPath.startsWith(prefix)) return null;

  const rel = decodeURIComponent(urlPath.slice(prefix.length));
  if (!rel || rel.includes('..') || rel === 'manifest.json') return null;

  const abs = path.resolve(projectRoot, ACL_ROOT, rel);
  const rootAbs = path.resolve(projectRoot, ACL_ROOT);
  if (!abs.startsWith(rootAbs + path.sep) && abs !== rootAbs) return null;
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) return null;
  return abs;
}

function publishAclDocsToDist(projectRoot: string, outDir: string) {
  const srcDir = path.join(projectRoot, ACL_ROOT);
  const destDir = path.join(outDir, ACL_ROOT);

  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }

  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true });
  } else {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = listAclDocs(projectRoot);
  fs.writeFileSync(path.join(destDir, 'manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), files }, null, 2), 'utf8');
}

function publishDocsConsoleHtml(projectRoot: string, outDir: string) {
  const consoleSrc = path.join(projectRoot, 'acl-docs-console.html');
  if (!fs.existsSync(consoleSrc)) return;
  fs.copyFileSync(consoleSrc, path.join(outDir, 'acl-docs-console.html'));
}

export function aclDocsPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'acl-docs',
    configResolved(resolved) {
      config = resolved;
    },
    configureServer(server) {
      const projectRoot = server.config.root;

      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? '';

        if (url === '/api/acl-docs' || url === `/${ACL_ROOT}/manifest.json`) {
          try {
            sendJson(res, 200, { files: listAclDocs(projectRoot) });
          } catch (err) {
            sendJson(res, 500, {
              error: err instanceof Error ? err.message : 'Failed to list ACL docs',
            });
          }
          return;
        }

        const filePath = resolveAclFile(projectRoot, url);
        if (filePath) {
          const ext = path.extname(filePath).toLowerCase();
          const type =
            ext === '.md'
              ? 'text/markdown; charset=utf-8'
              : ext === '.yaml' || ext === '.yml'
                ? 'text/yaml; charset=utf-8'
                : 'application/octet-stream';
          res.statusCode = 200;
          res.setHeader('Content-Type', type);
          fs.createReadStream(filePath).pipe(res);
          return;
        }

        next();
      });
    },
    closeBundle() {
      // Production/static deploy: ship docs console + ACL docs into dist/
      if (config.command !== 'build') return;
      const outDir = path.resolve(config.root, config.build.outDir);
      publishAclDocsToDist(config.root, outDir);
      publishDocsConsoleHtml(config.root, outDir);
    },
  };
}

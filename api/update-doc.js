/**
 * POST /api/update-doc
 * Updates a markdown file under `_acl-output/` via the GitHub Contents API.
 *
 * Body: { path: string, content: string, message?: string, secret?: string }
 *
 * Env (Vercel Project Settings → Environment Variables):
 *   GITHUB_TOKEN   – fine-grained PAT with Contents: Read and write
 *   GITHUB_OWNER   – e.g. Karthik300895 (optional if GITHUB_REPO_URL set)
 *   GITHUB_REPO    – e.g. fleet-360
 *   GITHUB_BRANCH  – default main
 *   DOCS_EDIT_SECRET – optional shared password required from the viewer
 */
const ACL_PREFIX = '_acl-output/';

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function normalizeDocPath(input) {
  if (typeof input !== 'string' || !input.trim()) {
    throw new Error('path is required');
  }
  let rel = input.trim().replace(/\\/g, '/');
  if (rel.startsWith('/')) rel = rel.slice(1);
  if (rel.startsWith(ACL_PREFIX)) {
    rel = rel.slice(ACL_PREFIX.length);
  }
  if (!rel || rel.includes('..') || rel.startsWith('/') || rel.includes('\\')) {
    throw new Error('Invalid path');
  }
  if (!rel.endsWith('.md')) {
    throw new Error('Only .md files under _acl-output can be edited');
  }
  if (rel.endsWith('.memlog.md') || rel.split('/').includes('.memlog.md')) {
    throw new Error('Cannot edit internal memlog files');
  }
  return `${ACL_PREFIX}${rel}`;
}

function repoConfig() {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) {
    throw new Error('GITHUB_TOKEN is not configured on the server');
  }

  let owner = process.env.GITHUB_OWNER?.trim();
  let repo = process.env.GITHUB_REPO?.trim();
  const branch = (process.env.GITHUB_BRANCH || 'main').trim();

  if ((!owner || !repo) && process.env.GITHUB_REPO_URL) {
    const match = process.env.GITHUB_REPO_URL.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?/i);
    if (match) {
      owner = owner || match[1];
      repo = repo || match[2];
    }
  }

  if (!owner || !repo) {
    throw new Error('GITHUB_OWNER and GITHUB_REPO must be configured');
  }

  return { token, owner, repo, branch };
}

async function githubFetch(url, token, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'acl-docs-console',
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }
  return { res, data };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readBody(req);
    const editSecret = process.env.DOCS_EDIT_SECRET?.trim();
    if (editSecret) {
      const provided = (typeof body.secret === 'string' && body.secret) || req.headers['x-docs-edit-secret'] || '';
      if (provided !== editSecret) {
        json(res, 401, { error: 'Invalid edit secret' });
        return;
      }
    }

    if (typeof body.content !== 'string') {
      json(res, 400, { error: 'content must be a string' });
      return;
    }

    const repoPath = normalizeDocPath(body.path);
    const { token, owner, repo, branch } = repoConfig();
    const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`;

    // Probe repo access first — fine-grained PATs return 404 (not 403) when
    // the token is not granted to the repository.
    const repoProbe = await githubFetch(`https://api.github.com/repos/${owner}/${repo}`, token);
    if (repoProbe.res.status === 404) {
      json(res, 403, {
        error: `GitHub token cannot access ${owner}/${repo}. Edit the fine-grained PAT and grant this repository with Contents: Read and write, then update GITHUB_TOKEN in Vercel and redeploy.`,
      });
      return;
    }
    if (!repoProbe.res.ok) {
      json(res, repoProbe.res.status, {
        error: repoProbe.data?.message || 'Failed to access GitHub repository',
      });
      return;
    }

    const existing = await githubFetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, token);
    if (existing.res.status === 404) {
      json(res, 404, {
        error: `File not found on branch "${branch}": ${repoPath}`,
      });
      return;
    }
    if (!existing.res.ok) {
      json(res, existing.res.status, {
        error: existing.data?.message || 'Failed to read file from GitHub',
      });
      return;
    }

    const sha = existing.data?.sha;
    if (!sha) {
      json(res, 500, { error: 'GitHub did not return a file sha' });
      return;
    }

    const message = (typeof body.message === 'string' && body.message.trim()) || `docs: update ${repoPath}`;

    const put = await githubFetch(apiBase, token, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        content: Buffer.from(body.content, 'utf8').toString('base64'),
        sha,
        branch,
      }),
    });

    if (!put.res.ok) {
      json(res, put.res.status, {
        error: put.data?.message || 'Failed to commit file to GitHub',
        details: put.data?.errors || undefined,
      });
      return;
    }

    json(res, 200, {
      ok: true,
      path: repoPath,
      commit: put.data?.commit?.sha || null,
      html_url: put.data?.content?.html_url || put.data?.commit?.html_url || null,
      message: 'Saved to GitHub. This Vercel deployment still serves the previous build until the next deploy.',
    });
  } catch (err) {
    json(res, 500, {
      error: err instanceof Error ? err.message : 'Unexpected server error',
    });
  }
}

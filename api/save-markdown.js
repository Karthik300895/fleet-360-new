// ACL-ADLC Markdown Studio Serverless Save Endpoint (Vercel + GitHub REST API + self-hosted git)
import fs from 'node:fs';
import path from 'node:path';
import { gitCommitAndPush, isLocalServerMode, shouldAutoGitPush } from './lib/local-git-commit.js';
import { resolveMarkdownRepoPath } from './lib/resolve-markdown-repo-path.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-GitHub-Token');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Method Not Allowed. Use POST.' }));
    return;
  }

  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        // Ignore parse error
      }
    } else if (!payload) {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf8');
      if (raw) {
        try {
          payload = JSON.parse(raw);
        } catch {
          // Ignore parse error
        }
      }
    }

    const { folderPath, filename, content, status } = payload || {};

    if (!filename || typeof content !== 'string') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Missing required fields: filename and content.' }));
      return;
    }

    const { repoFilePath, cleanFilename } = resolveMarkdownRepoPath(folderPath, filename);
    const localServerMode = isLocalServerMode();

    // Detect GitHub Configuration: Check headers, body, or environment variables
    const rawHeaderAuth = req.headers['authorization'] || '';
    const rawCustomToken = req.headers['x-github-token'] || '';
    const rawBodyToken = (payload && payload.githubToken) || '';

    const token = (
      rawCustomToken ||
      rawHeaderAuth.replace(/^Bearer\s+/i, '').replace(/^token\s+/i, '') ||
      rawBodyToken ||
      process.env.GITHUB_TOKEN ||
      process.env.GH_TOKEN ||
      process.env.GITHUB_PAT ||
      ''
    ).trim();

    let owner = ((payload && payload.githubOwner) || process.env.GITHUB_OWNER || process.env.VERCEL_GIT_REPO_OWNER || '').trim();

    let repo = ((payload && payload.githubRepo) || process.env.GITHUB_REPO || process.env.VERCEL_GIT_REPO_SLUG || '').trim();

    const branch = ((payload && payload.githubBranch) || process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || 'main').trim();

    // Auto-detect owner and repo from package.json if not explicitly provided
    if (!owner || !repo) {
      try {
        const pkgPath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(pkgPath)) {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
          const repoUrl = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url;
          if (repoUrl) {
            const match = repoUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
            if (match) {
              if (!owner) owner = match[1];
              if (!repo) repo = match[2].replace(/\.git$/, '');
            }
          }
        }
      } catch {
        // Ignore package read error
      }
    }

    // Default repository fallback
    if (!owner) owner = 'karthick1827';
    if (!repo) repo = 'jira-clone';

    const cleanStatus = (status || '').trim();
    const commitMsg = cleanStatus
      ? `docs(review): update ${cleanFilename} status to [${cleanStatus}] via Markdown Studio`
      : `docs(${cleanFilename}): update content via Markdown Studio`;

    async function saveToLocalDiskWithOptionalGit() {
      const localTarget = path.join(process.cwd(), repoFilePath);
      fs.mkdirSync(path.dirname(localTarget), { recursive: true });
      fs.writeFileSync(localTarget, content, 'utf8');

      let gitResult = null;
      if (shouldAutoGitPush(payload)) {
        try {
          gitResult = await gitCommitAndPush(process.cwd(), repoFilePath, commitMsg);
        } catch (gitErr) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: false,
              mode: 'local-disk',
              path: repoFilePath,
              error: `File saved on disk but git push failed: ${gitErr.message}`,
              hint: 'Ensure this process runs inside the git clone and git remote credentials are configured on the server.',
            }),
          );
          return;
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          mode: gitResult?.pushed ? 'local-git' : 'local-disk',
          path: repoFilePath,
          status: status,
          git: gitResult,
          message: gitResult?.pushed
            ? `Saved ${cleanFilename} and pushed to origin (deploy workflow will run on push).`
            : `Saved ${cleanFilename} on server disk.`,
        }),
      );
    }

    // Self-hosted: write into the checkout and push with server git credentials
    if (localServerMode) {
      await saveToLocalDiskWithOptionalGit();
      return;
    }

    // 1. If GitHub Token is configured: Commit to GitHub via REST API
    if (token) {
      const authHeader =
        token.startsWith('Bearer ') || token.startsWith('token ') ? token : token.startsWith('ghp_') ? `token ${token}` : `Bearer ${token}`;

      const headers = {
        Accept: 'application/vnd.github.v3+json',
        Authorization: authHeader,
        'User-Agent': 'ACL-ADLC-Markdown-Studio',
      };

      // Check for existing file SHA
      let sha;
      const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${repoFilePath}?ref=${encodeURIComponent(branch)}`;
      try {
        const getRes = await fetch(getUrl, { headers });
        if (getRes.ok) {
          const fileData = await getRes.json();
          sha = fileData.sha;
        } else if (getRes.status === 401) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: false,
              error: 'GitHub Token is invalid or expired. Please check your token or re-enter it in Cloud Sync Settings.',
            }),
          );
          return;
        } else if (getRes.status === 403) {
          const errBody = await getRes.text();
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: false,
              error: `GitHub token lacks permission: ${errBody}`,
              hint: 'Token needs repo or contents:write permissions.',
            }),
          );
          return;
        }
      } catch {
        // Network or fetch error
      }

      const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${repoFilePath}`;
      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMsg,
          content: Buffer.from(content, 'utf8').toString('base64'),
          branch: branch,
          ...(sha ? { sha } : {}),
        }),
      });

      if (!putRes.ok) {
        const errText = await putRes.text();
        res.writeHead(putRes.status, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: false,
            error: `GitHub Commit failed (${putRes.status}): ${errText}`,
            hint: 'Verify GITHUB_TOKEN has write access (contents:write or repo scope) to ' + owner + '/' + repo,
          }),
        );
        return;
      }

      const commitResult = await putRes.json();

      // Best effort write to local disk if writable
      try {
        const localTarget = path.join(process.cwd(), repoFilePath);
        fs.mkdirSync(path.dirname(localTarget), { recursive: true });
        fs.writeFileSync(localTarget, content, 'utf8');
      } catch {
        // Local write is optional on serverless environments
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          mode: 'github',
          repo: `${owner}/${repo}`,
          branch: branch,
          path: repoFilePath,
          commitSha: commitResult.commit?.sha || commitResult.sha,
          status: status,
          message: `Successfully committed ${cleanFilename} to ${owner}/${repo}@${branch}`,
        }),
      );
      return;
    }

    // 2. Fallback: Save to local filesystem if no GitHub Token configured
    try {
      await saveToLocalDiskWithOptionalGit();
    } catch (diskErr) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: false,
          error: diskErr.message || 'Failed to write file on server disk.',
          hint:
            'Configure GITHUB_TOKEN for cloud commits, or run with ACL_LOCAL_SERVER=1 on your self-hosted checkout.',
        }),
      );
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
    );
  }
};

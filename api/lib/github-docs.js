const ACL_PREFIX = '_acl-output/'

export function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

export function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? JSON.parse(raw) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

export function normalizeDocPath(input) {
  if (typeof input !== 'string' || !input.trim()) {
    throw new Error('path is required')
  }
  let rel = input.trim().replace(/\\/g, '/')
  if (rel.startsWith('/')) rel = rel.slice(1)
  if (rel.startsWith(ACL_PREFIX)) {
    rel = rel.slice(ACL_PREFIX.length)
  }
  if (!rel || rel.includes('..') || rel.startsWith('/') || rel.includes('\\')) {
    throw new Error('Invalid path')
  }
  if (!rel.endsWith('.md')) {
    throw new Error('Only .md files under _acl-output can be edited')
  }
  if (rel.endsWith('.memlog.md') || rel.split('/').includes('.memlog.md')) {
    throw new Error('Cannot edit internal memlog files')
  }
  return `${ACL_PREFIX}${rel}`
}

export function buildDocPath(folderPath, filename) {
  if (typeof filename !== 'string' || !filename.trim()) {
    throw new Error('filename is required')
  }
  const cleanName = filename.trim().replace(/\\/g, '/')
  const cleanFolder = typeof folderPath === 'string' ? folderPath.trim().replace(/\\/g, '/').replace(/\/$/, '') : ''
  const combined = cleanFolder ? `${cleanFolder}/${cleanName}` : cleanName
  return normalizeDocPath(combined)
}

export function repoConfig() {
  const token = process.env.GITHUB_TOKEN?.trim()
  if (!token) {
    throw new Error(
      'GITHUB_TOKEN is not configured on the server. Add GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO in Vercel Project Settings → Environment Variables, then redeploy.',
    )
  }

  let owner = process.env.GITHUB_OWNER?.trim()
  let repo = process.env.GITHUB_REPO?.trim()
  const branch = (process.env.GITHUB_BRANCH || 'main').trim()

  if ((!owner || !repo) && process.env.GITHUB_REPO_URL) {
    const match = process.env.GITHUB_REPO_URL.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?/i)
    if (match) {
      owner = owner || match[1]
      repo = repo || match[2]
    }
  }

  if (!owner || !repo) {
    throw new Error('GITHUB_OWNER and GITHUB_REPO must be configured in Vercel environment variables')
  }

  return { token, owner, repo, branch }
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
  })
  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { message: text }
  }
  return { res, data }
}

export async function commitMarkdownToGitHub({ path, content, message }) {
  if (typeof content !== 'string') {
    throw new Error('content must be a string')
  }

  const repoPath = normalizeDocPath(path)
  const { token, owner, repo, branch } = repoConfig()
  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`

  const repoProbe = await githubFetch(`https://api.github.com/repos/${owner}/${repo}`, token)
  if (repoProbe.res.status === 404) {
    throw new Error(
      `GitHub token cannot access ${owner}/${repo}. Grant the PAT Contents read/write on this repo.`,
    )
  }
  if (!repoProbe.res.ok) {
    throw new Error(repoProbe.data?.message || 'Failed to access GitHub repository')
  }

  const existing = await githubFetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, token)
  if (existing.res.status === 404) {
    throw new Error(`File not found on branch "${branch}": ${repoPath}`)
  }
  if (!existing.res.ok) {
    throw new Error(existing.data?.message || 'Failed to read file from GitHub')
  }

  const sha = existing.data?.sha
  if (!sha) {
    throw new Error('GitHub did not return a file sha')
  }

  const commitMessage = message?.trim() || `docs: update ${repoPath}`
  const put = await githubFetch(apiBase, token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: commitMessage,
      content: Buffer.from(content, 'utf8').toString('base64'),
      sha,
      branch,
    }),
  })

  if (!put.res.ok) {
    throw new Error(put.data?.message || 'Failed to commit file to GitHub')
  }

  return {
    ok: true,
    path: repoPath,
    commit: put.data?.commit?.sha || null,
    html_url: put.data?.content?.html_url || put.data?.commit?.html_url || null,
    message:
      'Saved to GitHub. Redeploy on Vercel (or wait for auto-deploy) to refresh the static markdown bundle.',
  }
}

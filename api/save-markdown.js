/**
 * POST /api/save-markdown
 * Markdown Studio "Update" button — commits _acl-output markdown to GitHub on Vercel.
 *
 * Body: { folderPath, filename, content, status?, autoPush?, secret? }
 *
 * Requires Vercel env: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO
 * Optional: GITHUB_BRANCH (default main), DOCS_EDIT_SECRET, GITHUB_REPO_URL
 */
import { buildDocPath, commitMarkdownToGitHub, json, readBody } from './lib/github-docs.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-docs-edit-secret')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'POST') {
    json(res, 405, { success: false, error: 'Method not allowed' })
    return
  }

  try {
    const body = await readBody(req)
    const editSecret = process.env.DOCS_EDIT_SECRET?.trim()
    if (editSecret) {
      const provided =
        (typeof body.secret === 'string' && body.secret) || req.headers['x-docs-edit-secret'] || ''
      if (provided !== editSecret) {
        json(res, 401, { success: false, error: 'Invalid edit secret' })
        return
      }
    }

    const repoPath = buildDocPath(body.folderPath, body.filename)
    const statusLabel = typeof body.status === 'string' ? body.status : 'In Review'
    const result = await commitMarkdownToGitHub({
      path: repoPath,
      content: body.content,
      message: `docs: update ${body.filename} [${statusLabel}]`,
    })

    json(res, 200, {
      success: true,
      path: result.path,
      gitPushed: true,
      commit: result.commit,
      html_url: result.html_url,
      message: result.message,
    })
  } catch (err) {
    json(res, 500, {
      success: false,
      error: err instanceof Error ? err.message : 'Unexpected server error',
    })
  }
}

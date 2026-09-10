/**
 * POST /api/update-doc
 * Updates a markdown file under `_acl-output/` via the GitHub Contents API.
 *
 * Body: { path: string, content: string, message?: string, secret?: string }
 */
import { commitMarkdownToGitHub, json, readBody } from './lib/github-docs.js'

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
    json(res, 405, { error: 'Method not allowed' })
    return
  }

  try {
    const body = await readBody(req)
    const editSecret = process.env.DOCS_EDIT_SECRET?.trim()
    if (editSecret) {
      const provided =
        (typeof body.secret === 'string' && body.secret) || req.headers['x-docs-edit-secret'] || ''
      if (provided !== editSecret) {
        json(res, 401, { error: 'Invalid edit secret' })
        return
      }
    }

    const result = await commitMarkdownToGitHub({
      path: body.path,
      content: body.content,
      message: body.message,
    })

    json(res, 200, result)
  } catch (err) {
    json(res, 500, {
      error: err instanceof Error ? err.message : 'Unexpected server error',
    })
  }
}

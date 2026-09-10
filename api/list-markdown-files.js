/**
 * GET /api/list-markdown-files
 * Serves markdown files for Markdown Studio on Vercel (static deploy has no Vite middleware).
 * Reads build-time manifest from public/acl-markdown-files.json.
 */
import fs from 'node:fs'
import path from 'node:path'

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

function loadManifest() {
  const candidates = [
    path.join(process.cwd(), 'public', 'acl-markdown-files.json'),
    path.join(process.cwd(), 'acl-markdown-files.json'),
  ]

  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue
    const raw = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return { files: parsed }
    if (parsed && Array.isArray(parsed.files)) return parsed
  }

  return { files: [] }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'GET') {
    json(res, 405, { error: 'Method not allowed', files: [] })
    return
  }

  try {
    const manifest = loadManifest()
    json(res, 200, manifest)
  } catch (err) {
    json(res, 500, {
      files: [],
      error: err instanceof Error ? err.message : 'Failed to load markdown manifest',
    })
  }
}

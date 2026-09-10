import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const outputPath = path.join(projectRoot, 'public', 'acl-markdown-files.json')
const scanCandidates = [
  '_acl-output',
  'acl-output',
  'planning-artifacts',
  'implementation-artifacts',
  'docs',
]

/** @type {Array<{ id: string, folderPath: string, filename: string, status: string, updatedAt: string, content: string }>} */
const mdFiles = []

function collect(currentDir, relPrefix) {
  if (!fs.existsSync(currentDir)) return

  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    const full = path.join(currentDir, entry.name)
    const rel = relPrefix ? `${relPrefix}/${entry.name}` : entry.name

    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      collect(full, rel)
      continue
    }

    if (!entry.isFile() || !entry.name.endsWith('.md')) continue

    const content = fs.readFileSync(full, 'utf8')
    const stat = fs.statSync(full)
    let status = 'In Review'
    const match = content.match(/status:\s*([^\n\r]+)/i)

    if (match?.[1]) {
      const raw = match[1].trim().toLowerCase()
      if (
        raw.includes('accept') ||
        raw.includes('updated') ||
        raw.includes('final') ||
        raw.includes('approved')
      ) {
        status = 'Accepted'
      } else if (raw.includes('reject')) {
        status = 'Rejected'
      }
    }

    mdFiles.push({
      id: rel.replace(/[^a-zA-Z0-9_-]/g, '_'),
      folderPath: path.dirname(rel).replace(/\\/g, '/'),
      filename: entry.name,
      status,
      updatedAt: stat.mtime ? stat.mtime.toISOString() : new Date().toISOString(),
      content,
    })
  }
}

for (const folder of scanCandidates) {
  collect(path.join(projectRoot, folder), folder)
}

const manifest = {
  generatedAt: new Date().toISOString(),
  files: mdFiles,
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
console.log(`Generated ${mdFiles.length} markdown file(s) -> public/acl-markdown-files.json`)

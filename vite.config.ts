import fs from 'node:fs'
import path from 'node:path'
import { exec } from 'node:child_process'
import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type ViteDevServer } from 'vite'

type MarkdownFile = {
  id: string
  folderPath: string
  filename: string
  status: string
  updatedAt: string
  content: string
}

type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: unknown) => void,
) => void

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

// ACL-ADLC Markdown Studio Save Middleware
function aclMarkdownSaverPlugin(): Plugin {
  return {
    name: 'acl-markdown-saver',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/list-markdown-files', ((req, res, next) => {
        if (req.method === 'GET') {
          try {
            const projectRoot = process.cwd()
            const mdFiles: MarkdownFile[] = []
            const scanCandidates = [
              '_acl-output',
              'acl-output',
              'planning-artifacts',
              'implementation-artifacts',
              'docs',
            ]

            function collect(currentDir: string, relPrefix: string): void {
              if (!fs.existsSync(currentDir)) return
              const entries = fs.readdirSync(currentDir, { withFileTypes: true })
              for (const entry of entries) {
                const full = path.join(currentDir, entry.name)
                const rel = relPrefix ? `${relPrefix}/${entry.name}` : entry.name
                if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
                  collect(full, rel)
                } else if (entry.isFile() && entry.name.endsWith('.md')) {
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
                    } else {
                      status = 'In Review'
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
            }

            for (const folder of scanCandidates) {
              collect(path.join(projectRoot, folder), folder)
            }

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ files: mdFiles }))
          } catch (err: unknown) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ files: [], error: getErrorMessage(err) }))
          }
        } else {
          next()
        }
      }) as Middleware)

      server.middlewares.use('/api/save-markdown', ((req, res, next) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk: Buffer | string) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const { folderPath, filename, content, status, autoPush } = JSON.parse(body) as {
                folderPath?: string
                filename: string
                content: string
                status?: string
                autoPush?: boolean
              }
              const targetDir = path.resolve(process.cwd(), folderPath || '')
              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true })
              }
              const targetFile = path.join(targetDir, filename)
              fs.writeFileSync(targetFile, content, 'utf8')

              if (autoPush) {
                const gitCmd = `git add "${targetFile}" && git commit -m "docs: update ${filename} [${status || 'Accepted'}]" && git push`
                const env = {
                  ...process.env,
                  PATH: `${process.env.PATH || ''};C:\\Users\\karthick.natarajan\\AppData\\Local\\Programs\\Git\\cmd;C:\\Program Files\\Git\\cmd`,
                }
                exec(gitCmd, { cwd: process.cwd(), env }, (gitErr, _gitStdout, gitStderr) => {
                  if (gitErr) {
                    console.warn('[ACL Git Auto-Push]', gitErr.message || gitStderr)
                    res.setHeader('Content-Type', 'application/json')
                    res.end(
                      JSON.stringify({
                        success: true,
                        path: targetFile,
                        gitPushed: false,
                        gitError: gitErr.message,
                      }),
                    )
                  } else {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ success: true, path: targetFile, gitPushed: true }))
                  }
                })
              } else {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, path: targetFile, gitPushed: false }))
              }
            } catch (err: unknown) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: getErrorMessage(err) }))
            }
          })
        } else {
          next()
        }
      }) as Middleware)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [aclMarkdownSaverPlugin(), react()],
})

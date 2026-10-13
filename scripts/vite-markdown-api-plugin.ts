import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { fileURLToPath, pathToFileURL } from 'node:url'
import type { Plugin, ViteDevServer } from 'vite'

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

type ApiHandler = (
  req: IncomingMessage & { url?: string; body?: unknown },
  res: ServerResponse,
) => void | Promise<void>

/**
 * Vite dev server: wire /api/* to the same handlers used on Vercel and self-hosted Node.
 */
export default function aclMarkdownSaverPlugin(): Plugin {
  let listHandler: ApiHandler | null = null
  let saveHandler: ApiHandler | null = null

  async function loadHandlers(): Promise<void> {
    if (!listHandler || !saveHandler) {
      const [listMod, saveMod] = await Promise.all([
        import(pathToFileURL(path.join(projectRoot, 'api/list-markdown-files.js')).href),
        import(pathToFileURL(path.join(projectRoot, 'api/save-markdown.js')).href),
      ])
      listHandler = listMod.default as ApiHandler
      saveHandler = saveMod.default as ApiHandler
    }
  }

  return {
    name: 'acl-markdown-saver',
    configureServer(server: ViteDevServer) {
      process.env.ACL_LOCAL_SERVER = process.env.ACL_LOCAL_SERVER || '1'
      process.env.ACL_LOCAL_GIT_AUTO_PUSH = process.env.ACL_LOCAL_GIT_AUTO_PUSH || '1'

      server.middlewares.use('/api/list-markdown-files', (req, res, next) => {
        if (req.method !== 'GET') {
          next()
          return
        }
        void (async () => {
          try {
            await loadHandlers()
            const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
            const apiReq = req as IncomingMessage & { url: string }
            apiReq.url = `/api/list-markdown-files${query}`
            await listHandler!(apiReq, res)
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ files: [], error: message }))
          }
        })()
      })

      server.middlewares.use('/api/save-markdown', (req, res, next) => {
        if (req.method !== 'POST') {
          next()
          return
        }
        let body = ''
        req.on('data', (chunk: Buffer | string) => {
          body += chunk
        })
        req.on('end', () => {
          void (async () => {
            try {
              await loadHandlers()
              const apiReq = req as IncomingMessage & { url: string; body: unknown }
              apiReq.url = '/api/save-markdown'
              try {
                apiReq.body = JSON.parse(body) as unknown
              } catch {
                apiReq.body = body
              }
              await saveHandler!(apiReq, res)
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : String(err)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: message }))
            }
          })()
        })
      })
    },
  }
}

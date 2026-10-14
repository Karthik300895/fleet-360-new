import { ApiError } from '../shared/lib/ApiError'

type ErrorBody = {
  code?: string
  message?: string
}

function resolveUrl(path: string): string {
  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

async function readErrorBody(response: Response): Promise<ErrorBody | undefined> {
  try {
    const body: unknown = await response.json()
    if (!body || typeof body !== 'object') return undefined
    const record = body as ErrorBody
    return {
      code: typeof record.code === 'string' ? record.code : undefined,
      message: typeof record.message === 'string' ? record.message : undefined,
    }
  } catch {
    return undefined
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
  if (options.body !== undefined && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response
  try {
    response = await fetch(resolveUrl(path), { ...options, headers })
  } catch {
    throw new ApiError(
      'NETWORK_ERROR',
      'Unable to reach the server. Please try again.',
      0,
    )
  }

  if (!response.ok) {
    throw ApiError.fromResponse(response, await readErrorBody(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError('PARSE_ERROR', 'The server returned an unreadable response.', response.status)
  }
}

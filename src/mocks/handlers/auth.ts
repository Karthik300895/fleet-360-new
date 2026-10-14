import { http, HttpResponse } from 'msw'

const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const REJECTED_EMAIL = 'fail@example.com'

type LoginBody = {
  email?: unknown
  password?: unknown
}

function invalidCredentials() {
  return HttpResponse.json(
    {
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password.',
    },
    { status: 401 },
  )
}

export const authHandlers = [
  http.post('*/auth/login', async ({ request }) => {
    let body: LoginBody
    try {
      body = (await request.json()) as LoginBody
    } catch {
      return invalidCredentials()
    }

    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!VALID_EMAIL.test(email) || password.length === 0 || email.toLowerCase() === REJECTED_EMAIL) {
      return invalidCredentials()
    }

    const localPart = email.split('@')[0] ?? 'User'
    const displayName = localPart.charAt(0).toUpperCase() + localPart.slice(1)

    return HttpResponse.json({
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      user: {
        id: crypto.randomUUID(),
        email,
        displayName,
      },
    })
  }),
]

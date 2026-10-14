import { create } from 'zustand'
import { authApi, type LoginCredentials } from '../api/authApi'
import type { Session } from '../entities/session'
import { ApiError } from '../shared/lib/ApiError'

export const SESSION_STORAGE_KEY = 'fleet360:session'

type AuthState = {
  session: Session | null
  error: string | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  hydrate: () => void
}

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') return false
  const session = value as Session
  const expiresAt = Date.parse(session.expiresAt)
  return (
    typeof session.token === 'string' &&
    session.token.length > 0 &&
    typeof session.expiresAt === 'string' &&
    !Number.isNaN(expiresAt) &&
    expiresAt > Date.now() &&
    !!session.user &&
    typeof session.user.id === 'string' &&
    typeof session.user.email === 'string' &&
    typeof session.user.displayName === 'string'
  )
}

function readStoredSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isSession(parsed)) {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  error: null,
  isAuthenticated: false,

  async login(credentials) {
    set({ error: null })
    try {
      const session = await authApi.login(credentials)
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
      set({ session, isAuthenticated: true, error: null })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Unable to sign in. Please try again.'
      set({ error: message })
    }
  },

  logout() {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    set({ session: null, isAuthenticated: false, error: null })
  },

  hydrate() {
    const session = readStoredSession()
    set({
      session,
      isAuthenticated: session !== null,
      error: null,
    })
  },
}))

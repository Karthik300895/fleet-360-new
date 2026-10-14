import type { Session } from '../entities/session'
import type { User } from '../entities/user'
import { apiFetch } from './client'

export type LoginCredentials = {
  email: string
  password: string
}

type SessionDto = {
  token: string
  expiresAt: string
  user: {
    id: string
    email: string
    displayName: string
  }
}

function toUser(dto: SessionDto['user']): User {
  return {
    id: dto.id,
    email: dto.email,
    displayName: dto.displayName,
  }
}

function toSession(dto: SessionDto): Session {
  return {
    token: dto.token,
    user: toUser(dto.user),
    expiresAt: dto.expiresAt,
  }
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<Session> {
    const dto = await apiFetch<SessionDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return toSession(dto)
  },
}

import type { Device } from '../entities/device'
import type { DeviceFilter } from '../entities/deviceFilter'
import { apiFetch } from './client'

type DeviceDto = Device

export type DeviceUpdateInput = {
  name?: string
  floor?: string
  area?: string
  contactName?: string
  contactPhone?: string
}

function buildQuery(filter?: DeviceFilter): string {
  if (!filter) return ''
  const params = new URLSearchParams()
  if (filter.siteId && filter.siteId !== 'all') {
    params.set('siteId', filter.siteId)
  }
  if (filter.status) params.set('status', filter.status)
  if (filter.search) params.set('search', filter.search)
  if (filter.types?.length) params.set('types', filter.types.join(','))
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const devicesApi = {
  async list(filter?: DeviceFilter): Promise<Device[]> {
    return apiFetch<DeviceDto[]>(`/devices${buildQuery(filter)}`)
  },

  async getById(id: string): Promise<Device> {
    return apiFetch<DeviceDto>(`/devices/${id}`)
  },

  async update(id: string, input: DeviceUpdateInput): Promise<Device> {
    return apiFetch<DeviceDto>(`/devices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  },

  async remove(id: string): Promise<void> {
    await apiFetch<void>(`/devices/${id}`, { method: 'DELETE' })
  },
}

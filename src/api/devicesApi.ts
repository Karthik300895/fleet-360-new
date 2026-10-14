import type { Device } from '../entities/device'
import type { DeviceFilter } from '../entities/deviceFilter'
import { apiFetch } from './client'

type DeviceDto = {
  id: string
  name: string
  serialNumber: string
  siteId: string
  siteName: string
  type: Device['type']
  status: Device['status']
  wifiConnected: boolean
  powerOn: boolean
  hasAlert: boolean
  modeLabel: string
}

function toDevice(dto: DeviceDto): Device {
  return { ...dto }
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
    const dtos = await apiFetch<DeviceDto[]>(`/devices${buildQuery(filter)}`)
    return dtos.map(toDevice)
  },

  async getById(id: string): Promise<Device> {
    const dto = await apiFetch<DeviceDto>(`/devices/${id}`)
    return toDevice(dto)
  },

  async remove(id: string): Promise<void> {
    await apiFetch<void>(`/devices/${id}`, { method: 'DELETE' })
  },
}

import type { DeviceStatus, DeviceType } from './device'

export type DeviceFilter = {
  siteId?: string | null
  status?: DeviceStatus | null
  types?: DeviceType[]
  search?: string
}

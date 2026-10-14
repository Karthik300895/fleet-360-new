import type { DeviceStatus, DeviceType } from './device'

export type DeviceFilter = {
  siteId?: string | null
  status?: DeviceStatus | null
  types?: DeviceType[]
  search?: string
}

export type DevicePanelFilters = {
  location: string
  floor: string
  area: string
  connections: DeviceStatus[]
  types: DeviceType[]
  power: Array<'on' | 'off'>
  modes: string[]
}

export const DEFAULT_PANEL_FILTERS: DevicePanelFilters = {
  location: '',
  floor: '',
  area: '',
  connections: [],
  types: [],
  power: [],
  modes: [],
}

import type { Device } from '../../entities/device'
import type { DevicePanelFilters } from '../../entities/deviceFilter'
import type { DeviceSort } from '../../entities/deviceSort'

export function applyPanelFilters(devices: Device[], filters: DevicePanelFilters): Device[] {
  return devices.filter((device) => {
    if (filters.location && device.siteName !== filters.location) return false
    if (filters.floor && device.floor !== filters.floor) return false
    if (filters.area && device.area !== filters.area) return false
    if (filters.connections.length > 0 && !filters.connections.includes(device.status)) {
      return false
    }
    if (filters.types.length > 0 && !filters.types.includes(device.type)) return false
    if (filters.power.length > 0) {
      const powerState = device.powerOn ? 'on' : 'off'
      if (!filters.power.includes(powerState)) return false
    }
    if (filters.modes.length > 0 && !filters.modes.includes(device.modeLabel)) return false
    return true
  })
}

export function applySearch(devices: Device[], search: string): Device[] {
  const term = search.trim().toLowerCase()
  if (!term) return devices
  return devices.filter(
    (device) =>
      device.name.toLowerCase().includes(term) ||
      device.serialNumber.toLowerCase().includes(term) ||
      device.macAddress.toLowerCase().includes(term),
  )
}

function sortValue(device: Device, field: DeviceSort['field']): string | number {
  switch (field) {
    case 'name':
      return device.name.toLowerCase()
    case 'serialNumber':
      return device.serialNumber.toLowerCase()
    case 'macAddress':
      return device.macAddress.toLowerCase()
    case 'meetingSetpoint':
      return device.meetingSetpoint
    case 'heatingHours':
      return device.heatingHours
    case 'coolingHours':
      return device.coolingHours
    default:
      return device.name
  }
}

export function applySort(devices: Device[], sort: DeviceSort): Device[] {
  const sorted = [...devices]
  sorted.sort((a, b) => {
    const left = sortValue(a, sort.field)
    const right = sortValue(b, sort.field)
    if (left < right) return sort.direction === 'asc' ? -1 : 1
    if (left > right) return sort.direction === 'asc' ? 1 : -1
    return 0
  })
  return sorted
}

export function hasActivePanelFilters(filters: DevicePanelFilters): boolean {
  return (
    Boolean(filters.location || filters.floor || filters.area) ||
    filters.connections.length > 0 ||
    filters.types.length > 0 ||
    filters.power.length > 0 ||
    filters.modes.length > 0
  )
}

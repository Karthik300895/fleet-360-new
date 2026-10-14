export type DeviceSortField =
  | 'name'
  | 'serialNumber'
  | 'macAddress'
  | 'meetingSetpoint'
  | 'heatingHours'
  | 'coolingHours'

export type DeviceSortDirection = 'asc' | 'desc'

export type DeviceSort = {
  field: DeviceSortField
  direction: DeviceSortDirection
}

export const DEFAULT_DEVICE_SORT: DeviceSort = {
  field: 'name',
  direction: 'asc',
}

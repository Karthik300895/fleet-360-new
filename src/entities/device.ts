export type DeviceType = 'air' | 'water' | 'cooler'

export type DeviceStatus = 'online' | 'offline'

export type Device = {
  id: string
  name: string
  serialNumber: string
  siteId: string
  siteName: string
  type: DeviceType
  status: DeviceStatus
  wifiConnected: boolean
  powerOn: boolean
  hasAlert: boolean
  modeLabel: string
}

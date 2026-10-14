export type DeviceType = 'air' | 'water' | 'cooler'

export type DeviceStatus = 'online' | 'offline'

export type Device = {
  id: string
  name: string
  serialNumber: string
  macAddress: string
  modelNumber: string
  siteId: string
  siteName: string
  floor: string
  area: string
  type: DeviceType
  status: DeviceStatus
  wifiConnected: boolean
  powerOn: boolean
  hasAlert: boolean
  modeLabel: string
  meetingSetpoint: number
  heatingHours: number
  coolingHours: number
  contactName: string
  contactPhone: string
  insightText: string
  warrantyExpires: string
  nextServiceDue: string
  serviceDueWarning: boolean
  notes: string
  coolSetpoint: number
  lockoutCool: number
  lockoutHeat: number
  supplyTemp: number
  returnTemp: number
  runtimeHeatingKwh: number[]
  runtimeCoolingKwh: number[]
}

export type UploadRow = {
  rowNumber: number
  deviceName: string
  serialNumber: string
  macAddress: string
  modelNumber: string
  site: string
  floor: string
  area: string
  deviceType: string
  valid: boolean
  errors: string[]
}

export type UploadParseResult = {
  fileName: string
  rows: UploadRow[]
}

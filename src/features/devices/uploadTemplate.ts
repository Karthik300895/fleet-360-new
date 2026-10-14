const HEADERS = [
  'Device Name',
  'Serial Number',
  'MAC Address',
  'Model Number',
  'Site',
  'Floor',
  'Area',
  'Device Type',
]

export async function downloadDeviceUploadTemplate(): Promise<void> {
  const XLSX = await import('xlsx')
  const worksheet = XLSX.utils.aoa_to_sheet([HEADERS])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Devices')
  XLSX.writeFile(workbook, 'device-upload-template.xlsx')
}

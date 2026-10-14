import { http, HttpResponse } from 'msw'
import type { Device } from '../../entities/device'
import { MOCK_DEVICES } from '../fixtures/devices'

let pendingUpload: { fileName: string; rows: Array<Record<string, unknown>> } | null = null

function mapDeviceType(value: string): Device['type'] {
  const normalized = value.toLowerCase()
  if (normalized.includes('cool')) return 'cooler'
  if (normalized.includes('water')) return 'water'
  return 'air'
}

function siteIdFromName(site: string): string {
  const map: Record<string, string> = {
    Orchid: 'orchid',
    'Northridge Middle': 'northridge-middle',
    'Greenwood Corporate': 'greenwood-corporate',
    'Summit Industrial Park': 'summit-industrial',
  }
  return map[site] ?? 'orchid'
}

export const uploadHandlers = [
  http.post('*/devices/upload/parse', async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) {
      return HttpResponse.json(
        { code: 'INVALID_FILE', message: 'Upload failed — only .xlsx files are accepted' },
        { status: 400 },
      )
    }
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      return HttpResponse.json(
        { code: 'INVALID_FILE', message: 'Upload failed — only .xlsx files are accepted' },
        { status: 400 },
      )
    }

    const rows = [
      {
        rowNumber: 2,
        deviceName: 'Imported Unit',
        serialNumber: 'SN-IMP-9001',
        macAddress: '00:11:22:33:44:55',
        modelNumber: 'M-100',
        site: 'Orchid',
        floor: '1',
        area: 'North',
        deviceType: 'Air',
        valid: true,
        errors: [] as string[],
      },
    ]

    pendingUpload = { fileName: file.name, rows }
    return HttpResponse.json({ fileName: file.name, rows })
  }),

  http.post('*/devices/upload/commit', async () => {
    if (!pendingUpload) {
      return HttpResponse.json(
        { code: 'NO_UPLOAD', message: 'No upload session to commit.' },
        { status: 400 },
      )
    }

    for (const row of pendingUpload.rows) {
      const siteName = String(row.site ?? 'Orchid')
      const device: Device = {
        id: `dev-${crypto.randomUUID().slice(0, 8)}`,
        name: String(row.deviceName ?? 'Imported Device'),
        serialNumber: String(row.serialNumber ?? 'SN-UNKNOWN'),
        macAddress: String(row.macAddress ?? '00:00:00:00:00:00'),
        modelNumber: String(row.modelNumber ?? 'GEN-1'),
        siteId: siteIdFromName(siteName),
        siteName,
        floor: String(row.floor ?? '1'),
        area: String(row.area ?? 'General'),
        type: mapDeviceType(String(row.deviceType ?? 'Air')),
        status: 'online',
        wifiConnected: true,
        powerOn: true,
        hasAlert: false,
        modeLabel: 'Cooling',
        meetingSetpoint: 72,
        heatingHours: 0,
        coolingHours: 0,
        contactName: 'Site Contact',
        contactPhone: '(555) 000-0000',
        insightText: 'Newly onboarded device.',
        warrantyExpires: '2027-01-01',
        nextServiceDue: '2027-06-01',
        serviceDueWarning: false,
        notes: '',
        coolSetpoint: 74,
        lockoutCool: 45,
        lockoutHeat: 95,
        supplyTemp: 70,
        returnTemp: 72,
        runtimeHeatingKwh: [0, 0, 0, 0, 0, 0, 0],
        runtimeCoolingKwh: [0, 0, 0, 0, 0, 0, 0],
      }
      MOCK_DEVICES.push(device)
    }

    pendingUpload = null
    return new HttpResponse(null, { status: 204 })
  }),
]

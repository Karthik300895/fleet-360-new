import { http, HttpResponse } from 'msw'
import { MOCK_DEVICES } from '../fixtures/devices'

function filterDevices(siteId: string | null, search: string | null): typeof MOCK_DEVICES {
  let list = [...MOCK_DEVICES]
  if (siteId) {
    list = list.filter((device) => device.siteId === siteId)
  }
  if (search) {
    const term = search.toLowerCase()
    list = list.filter(
      (device) =>
        device.name.toLowerCase().includes(term) ||
        device.serialNumber.toLowerCase().includes(term) ||
        device.macAddress.toLowerCase().includes(term),
    )
  }
  return list
}

export const deviceHandlers = [
  http.get('*/devices', ({ request }) => {
    const url = new URL(request.url)
    const siteId = url.searchParams.get('siteId')
    const search = url.searchParams.get('search')
    return HttpResponse.json(filterDevices(siteId, search))
  }),

  http.get('*/devices/:deviceId', ({ params }) => {
    const device = MOCK_DEVICES.find((item) => item.id === params.deviceId)
    if (!device) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Device not found.' },
        { status: 404 },
      )
    }
    return HttpResponse.json(device)
  }),

  http.patch('*/devices/:deviceId', async ({ params, request }) => {
    const device = MOCK_DEVICES.find((item) => item.id === params.deviceId)
    if (!device) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Device not found.' },
        { status: 404 },
      )
    }
    const body = (await request.json()) as Record<string, unknown>
    if (typeof body.name === 'string') device.name = body.name
    if (typeof body.floor === 'string') device.floor = body.floor
    if (typeof body.area === 'string') device.area = body.area
    if (typeof body.contactName === 'string') device.contactName = body.contactName
    if (typeof body.contactPhone === 'string') device.contactPhone = body.contactPhone
    return HttpResponse.json(device)
  }),

  http.delete('*/devices/:deviceId', ({ params }) => {
    const index = MOCK_DEVICES.findIndex((item) => item.id === params.deviceId)
    if (index < 0) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Device not found.' },
        { status: 404 },
      )
    }
    MOCK_DEVICES.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]

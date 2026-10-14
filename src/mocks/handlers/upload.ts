import { http, HttpResponse } from 'msw'

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
    return HttpResponse.json({
      fileName: file.name,
      rows: [
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
          errors: [],
        },
      ],
    })
  }),

  http.post('*/devices/upload/commit', () => new HttpResponse(null, { status: 204 })),
]

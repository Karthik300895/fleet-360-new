import type { UploadParseResult } from '../entities/upload'
import { apiFetch } from './client'

type UploadParseDto = UploadParseResult

export const uploadApi = {
  async parse(file: File): Promise<UploadParseResult> {
    const formData = new FormData()
    formData.append('file', file)
    const dto = await apiFetch<UploadParseDto>('/devices/upload/parse', {
      method: 'POST',
      body: formData,
    })
    return dto
  },

  async commit(fileName: string): Promise<void> {
    await apiFetch<void>('/devices/upload/commit', {
      method: 'POST',
      body: JSON.stringify({ fileName }),
    })
  },
}

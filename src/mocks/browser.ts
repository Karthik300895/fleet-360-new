import { setupWorker } from 'msw/browser'
import { authHandlers } from './handlers/auth'
import { deviceHandlers } from './handlers/devices'
import { uploadHandlers } from './handlers/upload'

export const worker = setupWorker(...authHandlers, ...deviceHandlers, ...uploadHandlers)

export async function startMSW(): Promise<void> {
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}

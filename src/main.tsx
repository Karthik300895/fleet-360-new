import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './app/App'
import { useAuthStore } from './stores/useAuthStore'
import { useShellStore } from './stores/useShellStore'

async function bootstrap(): Promise<void> {
  if (import.meta.env.VITE_USE_MSW !== 'false') {
    const { startMSW } = await import('./mocks/browser')
    await startMSW()
  }

  useAuthStore.getState().hydrate()
  useShellStore.getState().hydrate()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()

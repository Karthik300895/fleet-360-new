import { create } from 'zustand'
import { devicesApi } from '../api/devicesApi'
import type { Device } from '../entities/device'
import type { DeviceFilter } from '../entities/deviceFilter'
import { ApiError } from '../shared/lib/ApiError'

const POLL_MS = 30_000

type DeviceState = {
  devices: Device[]
  loading: boolean
  error: string | null
  pollTimer: ReturnType<typeof setInterval> | null
  lastFilter: DeviceFilter | undefined
  fetchDevices: (filter?: DeviceFilter) => Promise<void>
  startPolling: (filter?: DeviceFilter) => void
  stopPolling: () => void
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  devices: [],
  loading: false,
  error: null,
  pollTimer: null,
  lastFilter: undefined,

  async fetchDevices(filter) {
    set({ loading: true, error: null, lastFilter: filter })
    try {
      const devices = await devicesApi.list(filter)
      set({ devices, loading: false })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Unable to load devices. Please try again.'
      set({ error: message, loading: false })
    }
  },

  startPolling(filter) {
    const { pollTimer } = get()
    if (pollTimer) {
      clearInterval(pollTimer)
    }
    void get().fetchDevices(filter)
    const timer = setInterval(() => {
      void get().fetchDevices(get().lastFilter)
    }, POLL_MS)
    set({ pollTimer: timer })
  },

  stopPolling() {
    const { pollTimer } = get()
    if (pollTimer) {
      clearInterval(pollTimer)
    }
    set({ pollTimer: null })
  },
}))

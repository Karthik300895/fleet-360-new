import { create } from 'zustand'
import {
  DEFAULT_PANEL_FILTERS,
  type DevicePanelFilters,
} from '../entities/deviceFilter'
import { DEFAULT_DEVICE_SORT, type DeviceSort } from '../entities/deviceSort'

const STORAGE_KEY = 'fleet360:deviceListUi'

type PersistedUi = {
  appliedFilters: DevicePanelFilters
  sort: DeviceSort
  search: string
}

type DeviceListUiState = {
  filtersOpen: boolean
  sortOpen: boolean
  draftFilters: DevicePanelFilters
  appliedFilters: DevicePanelFilters
  sort: DeviceSort
  draftSort: DeviceSort
  search: string
  hydrate: () => void
  openFilters: () => void
  closeFilters: () => void
  openSort: () => void
  closeSort: () => void
  setDraftFilters: (filters: DevicePanelFilters) => void
  clearDraftFilters: () => void
  applyFilters: () => void
  clearAppliedFilters: () => void
  setDraftSort: (sort: DeviceSort) => void
  resetDraftSort: () => void
  applySort: () => void
  setSearch: (search: string) => void
}

function persist(state: PersistedUi): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function readPersisted(): PersistedUi | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedUi
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const useDeviceListUiStore = create<DeviceListUiState>((set, get) => ({
  filtersOpen: false,
  sortOpen: false,
  draftFilters: DEFAULT_PANEL_FILTERS,
  appliedFilters: DEFAULT_PANEL_FILTERS,
  sort: DEFAULT_DEVICE_SORT,
  draftSort: DEFAULT_DEVICE_SORT,
  search: '',

  hydrate() {
    const saved = readPersisted()
    if (!saved) return
    set({
      appliedFilters: saved.appliedFilters,
      draftFilters: saved.appliedFilters,
      sort: saved.sort,
      draftSort: saved.sort,
      search: saved.search,
    })
  },

  openFilters() {
    set({ filtersOpen: true, draftFilters: get().appliedFilters })
  },

  closeFilters() {
    set({ filtersOpen: false })
  },

  openSort() {
    set({ sortOpen: true, draftSort: get().sort })
  },

  closeSort() {
    set({ sortOpen: false })
  },

  setDraftFilters(filters) {
    set({ draftFilters: filters })
  },

  clearDraftFilters() {
    set({ draftFilters: DEFAULT_PANEL_FILTERS })
  },

  applyFilters() {
    const appliedFilters = get().draftFilters
    set({ appliedFilters, filtersOpen: false })
    persist({
      appliedFilters,
      sort: get().sort,
      search: get().search,
    })
  },

  clearAppliedFilters() {
    set({
      appliedFilters: DEFAULT_PANEL_FILTERS,
      draftFilters: DEFAULT_PANEL_FILTERS,
    })
    persist({
      appliedFilters: DEFAULT_PANEL_FILTERS,
      sort: get().sort,
      search: get().search,
    })
  },

  setDraftSort(sort) {
    set({ draftSort: sort })
  },

  resetDraftSort() {
    set({ draftSort: DEFAULT_DEVICE_SORT })
  },

  applySort() {
    const sort = get().draftSort
    set({ sort, sortOpen: false })
    persist({
      appliedFilters: get().appliedFilters,
      sort,
      search: get().search,
    })
  },

  setSearch(search) {
    set({ search })
    persist({
      appliedFilters: get().appliedFilters,
      sort: get().sort,
      search,
    })
  },
}))

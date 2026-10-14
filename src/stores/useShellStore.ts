import { create } from 'zustand'

export const SHELL_STORAGE_KEY = 'fleet360:shell'

export const SITE_OPTIONS = [
  { id: 'all', label: 'All Sites' },
  { id: 'northridge-middle', label: 'Northridge Middle' },
  { id: 'orchid', label: 'Orchid' },
  { id: 'greenwood-corporate', label: 'Greenwood Corporate' },
  { id: 'summit-industrial', label: 'Summit Industrial Park' },
  { id: 'sunrise-villa', label: 'Sunrise Villa' },
  { id: 'urban-heaven', label: 'Urban Heaven' },
] as const

export type SiteId = (typeof SITE_OPTIONS)[number]['id']

type ShellState = {
  selectedSiteId: SiteId
  setSelectedSiteId: (siteId: SiteId) => void
  hydrate: () => void
}

function readStoredSiteId(): SiteId {
  try {
    const raw = localStorage.getItem(SHELL_STORAGE_KEY)
    if (!raw) return 'all'
    const parsed: unknown = JSON.parse(raw)
    if (
      parsed &&
      typeof parsed === 'object' &&
      'selectedSiteId' in parsed &&
      typeof (parsed as { selectedSiteId: unknown }).selectedSiteId === 'string'
    ) {
      const id = (parsed as { selectedSiteId: string }).selectedSiteId
      if (SITE_OPTIONS.some((site) => site.id === id)) {
        return id as SiteId
      }
    }
  } catch {
    localStorage.removeItem(SHELL_STORAGE_KEY)
  }
  return 'all'
}

function persistSiteId(siteId: SiteId): void {
  localStorage.setItem(SHELL_STORAGE_KEY, JSON.stringify({ selectedSiteId: siteId }))
}

export const useShellStore = create<ShellState>((set) => ({
  selectedSiteId: 'all',

  setSelectedSiteId(siteId) {
    persistSiteId(siteId)
    set({ selectedSiteId: siteId })
  },

  hydrate() {
    set({ selectedSiteId: readStoredSiteId() })
  },
}))

export function getSelectedSiteLabel(siteId: SiteId): string {
  return SITE_OPTIONS.find((site) => site.id === siteId)?.label ?? 'All Sites'
}

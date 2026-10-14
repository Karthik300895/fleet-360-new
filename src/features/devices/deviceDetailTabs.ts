export const DEVICE_DETAIL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'controls', label: 'Controls' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'device-info', label: 'Device Info' },
] as const

export type DeviceDetailTabId = (typeof DEVICE_DETAIL_TABS)[number]['id']

export function isDeviceDetailTab(value: string | undefined): value is DeviceDetailTabId {
  return DEVICE_DETAIL_TABS.some((tab) => tab.id === value)
}

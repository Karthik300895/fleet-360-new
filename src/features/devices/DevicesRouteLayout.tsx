import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useShellStore } from '../../stores/useShellStore'
import { useDeviceStore } from '../../stores/useDeviceStore'

export function DevicesRouteLayout() {
  const selectedSiteId = useShellStore((state) => state.selectedSiteId)

  useEffect(() => {
    const siteFilter = selectedSiteId === 'all' ? undefined : selectedSiteId
    useDeviceStore.getState().startPolling({ siteId: siteFilter })
    return () => useDeviceStore.getState().stopPolling()
  }, [selectedSiteId])

  return <Outlet />
}

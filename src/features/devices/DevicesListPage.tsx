import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BadgeDeviceType, BadgeOnline, ButtonOutline, ButtonSecondary } from '../../shared/ui'
import { useDeviceStore } from '../../stores/useDeviceStore'
import { useDeviceListUiStore } from '../../stores/useDeviceListUiStore'
import { devicesApi } from '../../api/devicesApi'
import {
  applyPanelFilters,
  applySearch,
  applySort,
  hasActivePanelFilters,
} from './deviceListUtils'
import { FiltersPanel } from './panels/FiltersPanel'
import { SortPanel } from './panels/SortPanel'
import { ConfirmDialog } from './ConfirmDialog'
import styles from './DevicesListPage.module.css'

export function DevicesListPage() {
  const navigate = useNavigate()
  const devices = useDeviceStore((state) => state.devices)
  const loading = useDeviceStore((state) => state.loading)
  const error = useDeviceStore((state) => state.error)
  const refresh = useDeviceStore((state) => state.refresh)

  const search = useDeviceListUiStore((state) => state.search)
  const setSearch = useDeviceListUiStore((state) => state.setSearch)
  const appliedFilters = useDeviceListUiStore((state) => state.appliedFilters)
  const sort = useDeviceListUiStore((state) => state.sort)
  const openFilters = useDeviceListUiStore((state) => state.openFilters)
  const openSort = useDeviceListUiStore((state) => state.openSort)
  const clearAppliedFilters = useDeviceListUiStore((state) => state.clearAppliedFilters)

  const [menuDeviceId, setMenuDeviceId] = useState<string | null>(null)
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null)

  const rows = useMemo(() => {
    const filtered = applyPanelFilters(devices, appliedFilters)
    const searched = applySearch(filtered, search)
    return applySort(searched, sort)
  }, [devices, appliedFilters, search, sort])

  const fleetEmpty = !loading && devices.length === 0
  const filterEmpty = !loading && devices.length > 0 && rows.length === 0
  const filtersActive = hasActivePanelFilters(appliedFilters)

  async function confirmRemove() {
    if (!removeTarget) return
    await devicesApi.remove(removeTarget.id)
    setRemoveTarget(null)
    await refresh()
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Manage Devices</h1>
        <Link to="/devices/upload" className={styles.uploadLink}>Upload devices</Link>
      </header>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="search"
          placeholder="Search devices"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search devices"
        />
        <ButtonSecondary type="button" onClick={openFilters}>Filters</ButtonSecondary>
        <ButtonSecondary type="button" onClick={openSort}>Sort</ButtonSecondary>
      </div>

      {filtersActive ? (
        <p className={styles.matchCount}>
          {rows.length} device{rows.length === 1 ? '' : 's'} match your filters
        </p>
      ) : null}

      {error ? <p className={styles.error} role="alert">{error}</p> : null}

      {loading ? (
        <div className={styles.skeleton} aria-busy="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={styles.skeletonRow} />
          ))}
        </div>
      ) : null}

      {fleetEmpty ? (
        <div className={styles.empty}>
          <p>No devices yet. Upload devices to get started.</p>
          <Link to="/devices/upload">Go to Upload</Link>
        </div>
      ) : null}

      {filterEmpty ? (
        <div className={styles.empty}>
          <p>No devices match these filters.</p>
          <ButtonOutline type="button" onClick={clearAppliedFilters}>Clear filters</ButtonOutline>
        </div>
      ) : null}

      {!loading && rows.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Device</th>
              <th scope="col">Site</th>
              <th scope="col">Type</th>
              <th scope="col">Status</th>
              <th scope="col">Indicators</th>
              <th scope="col" className={styles.actionsCol}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((device) => (
              <tr key={device.id} className={styles.row}>
                <td
                  className={styles.clickable}
                  tabIndex={0}
                  onClick={() => navigate(`/devices/${device.id}/overview`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/devices/${device.id}/overview`)
                    }
                  }}
                >
                  <span className={styles.deviceName}>{device.name}</span>
                  <span className={styles.serial}>{device.serialNumber}</span>
                </td>
                <td>{device.siteName}</td>
                <td><BadgeDeviceType type={device.type} /></td>
                <td><BadgeOnline status={device.status} /></td>
                <td className={styles.icons} aria-label="Status indicators">
                  <span title="Wi-Fi">{device.wifiConnected ? '📶' : '📵'}</span>
                  <span title="Power">{device.powerOn ? '⚡' : '⭘'}</span>
                  <span title="Alert">{device.hasAlert ? '⚠️' : '✓'}</span>
                  <span title="Mode">{device.modeLabel}</span>
                </td>
                <td className={styles.actionsCol}>
                  <div className={styles.menuWrap}>
                    <button
                      type="button"
                      className={styles.kebab}
                      aria-label={`Actions for ${device.name}`}
                      onClick={() =>
                        setMenuDeviceId((current) => (current === device.id ? null : device.id))
                      }
                    >
                      ⋮
                    </button>
                    {menuDeviceId === device.id ? (
                      <div className={styles.menu} role="menu">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setMenuDeviceId(null)
                            navigate(`/devices/${device.id}/edit`)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setMenuDeviceId(null)
                            setRemoveTarget({ id: device.id, name: device.name })
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <FiltersPanel devices={devices} />
      <SortPanel />

      <ConfirmDialog
        open={removeTarget !== null}
        title="Remove device"
        message={`Remove ${removeTarget?.name ?? 'this device'} from the registry?`}
        confirmLabel="Remove"
        onCancel={() => setRemoveTarget(null)}
        onConfirm={() => void confirmRemove()}
      />
    </div>
  )
}

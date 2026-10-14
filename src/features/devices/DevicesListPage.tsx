import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BadgeDeviceType, BadgeOnline } from '../../shared/ui'
import { useDeviceStore } from '../../stores/useDeviceStore'
import styles from './DevicesListPage.module.css'

export function DevicesListPage() {
  const navigate = useNavigate()
  const devices = useDeviceStore((state) => state.devices)
  const loading = useDeviceStore((state) => state.loading)
  const error = useDeviceStore((state) => state.error)

  const showEmpty = !loading && devices.length === 0

  const rows = useMemo(() => devices, [devices])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Manage Devices</h1>
        <Link to="/devices/upload" className={styles.uploadLink}>Upload devices</Link>
      </header>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      {loading ? (
        <div className={styles.skeleton} aria-busy="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={styles.skeletonRow} />
          ))}
        </div>
      ) : null}
      {showEmpty ? (
        <div className={styles.empty}>
          <p>No devices yet. Upload devices to get started.</p>
          <Link to="/devices/upload">Go to Upload</Link>
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
            </tr>
          </thead>
          <tbody>
            {rows.map((device) => (
              <tr
                key={device.id}
                className={styles.row}
                tabIndex={0}
                onClick={() => navigate(`/devices/${device.id}/overview`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    navigate(`/devices/${device.id}/overview`)
                  }
                }}
              >
                <td>
                  <span className={styles.deviceName}>{device.name}</span>
                  <span className={styles.serial}>{device.serialNumber}</span>
                </td>
                <td>{device.siteName}</td>
                <td>
                  <BadgeDeviceType type={device.type} />
                </td>
                <td>
                  <BadgeOnline status={device.status} />
                </td>
                <td className={styles.icons} aria-label="Status indicators">
                  <span title="Wi-Fi">{device.wifiConnected ? '📶' : '📵'}</span>
                  <span title="Power">{device.powerOn ? '⚡' : '⭘'}</span>
                  <span title="Alert">{device.hasAlert ? '⚠️' : '✓'}</span>
                  <span title="Mode">{device.modeLabel}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}

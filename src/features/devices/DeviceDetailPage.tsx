import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { devicesApi } from '../../api/devicesApi'
import type { Device } from '../../entities/device'
import styles from './DeviceDetailPage.module.css'

export function DeviceDetailPage() {
  const { deviceId, tab } = useParams()
  const [device, setDevice] = useState<Device | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!deviceId) return
    void devicesApi
      .getById(deviceId)
      .then(setDevice)
      .catch(() => setError('Device not found.'))
  }, [deviceId])

  return (
    <div className={styles.page}>
      <Link to="/devices" className={styles.back}>← Back to devices</Link>
      {error ? <p role="alert">{error}</p> : null}
      {device ? (
        <>
          <h1 className={styles.title}>{device.name}</h1>
          <p className={styles.meta}>
            Tab: <strong>{tab ?? 'overview'}</strong> — detail tabs expand in Stories 2.7–2.10.
          </p>
        </>
      ) : null}
    </div>
  )
}

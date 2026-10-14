import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { devicesApi } from '../../api/devicesApi'
import type { Device } from '../../entities/device'
import { BadgeDeviceType, BadgeOnline, InsightCard } from '../../shared/ui'
import { DEVICE_DETAIL_TABS, isDeviceDetailTab } from './deviceDetailTabs'
import { DeviceDetailTabContent } from './DeviceDetailTabContent'
import styles from './DeviceDetailPage.module.css'

export function DeviceDetailIndexRedirect() {
  const { deviceId } = useParams()
  return <Navigate to={`/devices/${deviceId}/overview`} replace />
}

export function DeviceDetailPage() {
  const { deviceId, tab } = useParams()
  const navigate = useNavigate()
  const [device, setDevice] = useState<Device | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!deviceId) return
    void devicesApi
      .getById(deviceId)
      .then(setDevice)
      .catch(() => setError('Device not found.'))
  }, [deviceId])

  if (!tab || !isDeviceDetailTab(tab)) {
    return <Navigate to={`/devices/${deviceId}/overview`} replace />
  }

  if (error) {
    return <p className={styles.page} role="alert">{error}</p>
  }

  if (!device) {
    return <p className={styles.page}>Loading device…</p>
  }

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <button type="button" className={styles.back} onClick={() => navigate('/devices')} aria-label="Back to device list">
          ←
        </button>
        <span>Devices / {device.name}</span>
      </div>

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{device.name}</h1>
          <div className={styles.badges}>
            <BadgeOnline status={device.status} />
            <BadgeDeviceType type={device.type} />
          </div>
          <p className={styles.meta}>
            {device.serialNumber} · {device.siteName} · Floor {device.floor} · {device.area}
          </p>
          <p className={styles.contact}>
            {device.contactName} · {device.contactPhone}
          </p>
        </div>
        <InsightCard>{device.insightText}</InsightCard>
      </header>

      <nav className={styles.tabs} aria-label="Device sections">
        {DEVICE_DETAIL_TABS.map((item) => (
          <Link
            key={item.id}
            to={`/devices/${device.id}/${item.id}`}
            className={[styles.tab, tab === item.id ? styles.tabActive : ''].filter(Boolean).join(' ')}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.tabBody}>
        <DeviceDetailTabContent device={device} tab={tab} />
      </div>
    </div>
  )
}

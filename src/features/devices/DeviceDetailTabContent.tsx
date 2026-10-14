import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Device } from '../../entities/device'
import type { DeviceDetailTabId } from './deviceDetailTabs'
import { ButtonOutline } from '../../shared/ui'
import styles from './DeviceDetailTabContent.module.css'

type DeviceDetailTabContentProps = {
  device: Device
  tab: DeviceDetailTabId
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function DeviceDetailTabContent({ device, tab }: DeviceDetailTabContentProps) {
  const [coolSetpoint, setCoolSetpoint] = useState(device.coolSetpoint)
  const [lockoutCool, setLockoutCool] = useState(device.lockoutCool)
  const [lockoutHeat, setLockoutHeat] = useState(device.lockoutHeat)
  const [notes, setNotes] = useState(device.notes)

  const offline = device.status === 'offline'
  const heatingTotal = device.runtimeHeatingKwh.reduce((sum, value) => sum + value, 0)
  const coolingTotal = device.runtimeCoolingKwh.reduce((sum, value) => sum + value, 0)

  if (tab === 'schedule') {
    return (
      <div className={styles.stub}>
        <p>Coming in Phase 2</p>
        <Link to="/devices">
          <ButtonOutline type="button">Back to devices</ButtonOutline>
        </Link>
      </div>
    )
  }

  if (tab === 'overview') {
    const maxKwh = Math.max(...device.runtimeHeatingKwh, ...device.runtimeCoolingKwh, 1)
    const runtimeSummary = `Last 7 days heating total ${heatingTotal} kWh and cooling total ${coolingTotal} kWh.`
    return (
      <div className={styles.stack}>
        <section aria-label="Total runtime last 7 days">
          <h2 className={styles.sectionTitle}>Total Runtime</h2>
          <p className={styles.srSummary}>{runtimeSummary}</p>
          <div className={styles.chart} role="img" aria-label={runtimeSummary}>
            {DAY_LABELS.map((label, index) => (
              <div key={label} className={styles.barGroup}>
                <div
                  className={styles.barHeat}
                  style={{ height: `${(device.runtimeHeatingKwh[index] / maxKwh) * 100}%` }}
                  title={`Heating ${device.runtimeHeatingKwh[index]} kWh`}
                />
                <div
                  className={styles.barCool}
                  style={{ height: `${(device.runtimeCoolingKwh[index] / maxKwh) * 100}%` }}
                  title={`Cooling ${device.runtimeCoolingKwh[index]} kWh`}
                />
                <span className={styles.barLabel}>{label}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className={styles.sectionTitle}>Weather (7-day)</h2>
          <p className={styles.muted}>Partly cloudy · 62–78°F forecast strip (mock).</p>
        </section>
        <section>
          <h2 className={styles.sectionTitle}>Alerts &amp; Health</h2>
          <p>{device.hasAlert ? 'Active alert on this unit.' : 'No active alerts.'}</p>
        </section>
        <section>
          <h2 className={styles.sectionTitle}>Comfort &amp; Temperature</h2>
          <div className={styles.grid}>
            <div><span className={styles.label}>Supply</span><strong>{device.supplyTemp}°F</strong></div>
            <div><span className={styles.label}>Return</span><strong>{device.returnTemp}°F</strong></div>
          </div>
        </section>
        <section>
          <h2 className={styles.sectionTitle}>Maintenance &amp; Service</h2>
          <p>Next service due {device.nextServiceDue}</p>
        </section>
      </div>
    )
  }

  if (tab === 'analytics') {
    return (
      <div className={styles.stack}>
        <h2 className={styles.sectionTitle}>Historical runtime</h2>
        <p className={styles.muted}>Date range: Last 7 days · Total {heatingTotal + coolingTotal} hours (mock).</p>
        <div className={styles.lineChart} aria-label="Runtime trend line chart mock">
          {device.runtimeCoolingKwh.map((value, index) => (
            <span key={index} style={{ height: `${value * 3}px` }} />
          ))}
        </div>
        <p>Week-over-week runtime is reflected in the Insight card above.</p>
      </div>
    )
  }

  if (tab === 'controls') {
    return (
      <div className={styles.controlsGrid}>
        <Dial
          label="Set Point Cool Limit"
          value={coolSetpoint}
          disabled={offline}
          onDecrease={() => setCoolSetpoint((value) => value - 1)}
          onIncrease={() => setCoolSetpoint((value) => value + 1)}
        />
        <Dial
          label="Temperature Lockout Cool"
          value={lockoutCool}
          disabled={offline}
          onDecrease={() => setLockoutCool((value) => value - 1)}
          onIncrease={() => setLockoutCool((value) => value + 1)}
        />
        <Dial
          label="Temperature Lockout Heat"
          value={lockoutHeat}
          disabled={offline}
          onDecrease={() => setLockoutHeat((value) => value - 1)}
          onIncrease={() => setLockoutHeat((value) => value + 1)}
        />
      </div>
    )
  }

  if (tab === 'maintenance') {
    return (
      <div className={styles.stack}>
        <div className={styles.grid}>
          <div><span className={styles.label}>Warranty expires</span><strong>{device.warrantyExpires}</strong></div>
          <div>
            <span className={styles.label}>Next service due</span>
            <strong>
              {device.serviceDueWarning ? '⚠️ ' : ''}
              {device.nextServiceDue}
            </strong>
          </div>
        </div>
        <label className={styles.notesLabel}>
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Write notes"
            rows={4}
          />
        </label>
        <section>
          <h2 className={styles.sectionTitle}>Documents</h2>
          <p className={styles.muted}>No documents uploaded.</p>
        </section>
      </div>
    )
  }

  return (
    <div className={styles.stack}>
      <h2 className={styles.sectionTitle}>Device Details</h2>
      <div className={styles.kvGrid}>
        <div><span className={styles.label}>Serial</span><strong>{device.serialNumber}</strong></div>
        <div><span className={styles.label}>MAC</span><strong>{device.macAddress}</strong></div>
        <div><span className={styles.label}>Model</span><strong>{device.modelNumber}</strong></div>
        <div><span className={styles.label}>Site</span><strong>{device.siteName}</strong></div>
      </div>
      <h2 className={styles.sectionTitle}>Device Status</h2>
      <div className={styles.kvGrid}>
        <div><span className={styles.label}>Connection</span><strong>{device.status}</strong></div>
        <div><span className={styles.label}>Mode</span><strong>{device.modeLabel}</strong></div>
      </div>
      <h2 className={styles.sectionTitle}>Temperature Details</h2>
      <div className={styles.kvGrid}>
        <div><span className={styles.label}>Supply temp</span><strong>{device.supplyTemp}°F</strong></div>
        <div><span className={styles.label}>Return temp</span><strong>{device.returnTemp}°F</strong></div>
      </div>
    </div>
  )
}

type DialProps = {
  label: string
  value: number
  disabled: boolean
  onIncrease: () => void
  onDecrease: () => void
}

function Dial({ label, value, disabled, onIncrease, onDecrease }: DialProps) {
  return (
    <div className={styles.dial} title={disabled ? 'Device offline' : undefined}>
      <p className={styles.dialLabel}>{label}</p>
      <div className={[styles.dialCircle, disabled ? styles.dialDisabled : ''].filter(Boolean).join(' ')}>
        {disabled ? 'N/A' : `${value}°`}
      </div>
      <div className={styles.dialActions}>
        <button type="button" disabled={disabled} onClick={onDecrease} aria-label={`Decrease ${label}`}>←</button>
        <button type="button" disabled={disabled} onClick={onIncrease} aria-label={`Increase ${label}`}>→</button>
      </div>
    </div>
  )
}

import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { devicesApi } from '../../api/devicesApi'
import type { Device } from '../../entities/device'
import { ButtonOutline, ButtonPrimary } from '../../shared/ui'
import styles from './DeviceEditPage.module.css'

export function DeviceEditPage() {
  const { deviceId } = useParams()
  const navigate = useNavigate()
  const [device, setDevice] = useState<Device | null>(null)
  const [name, setName] = useState('')
  const [floor, setFloor] = useState('')
  const [area, setArea] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!deviceId) return
    void devicesApi.getById(deviceId).then((loaded) => {
      setDevice(loaded)
      setName(loaded.name)
      setFloor(loaded.floor)
      setArea(loaded.area)
      setContactName(loaded.contactName)
      setContactPhone(loaded.contactPhone)
    })
  }, [deviceId])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!deviceId) return
    setSaving(true)
    try {
      await devicesApi.update(deviceId, {
        name,
        floor,
        area,
        contactName,
        contactPhone,
      })
      navigate(`/devices/${deviceId}/overview`)
    } finally {
      setSaving(false)
    }
  }

  if (!device) {
    return <p className={styles.page}>Loading device…</p>
  }

  return (
    <div className={styles.page}>
      <Link to={`/devices/${deviceId}/overview`} className={styles.back}>← Back to device</Link>
      <h1 className={styles.title}>Edit {device.name}</h1>
      <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
        <label>
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Floor
          <input value={floor} onChange={(event) => setFloor(event.target.value)} required />
        </label>
        <label>
          Area
          <input value={area} onChange={(event) => setArea(event.target.value)} required />
        </label>
        <label>
          Contact name
          <input value={contactName} onChange={(event) => setContactName(event.target.value)} required />
        </label>
        <label>
          Contact phone
          <input value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} required />
        </label>
        <div className={styles.actions}>
          <ButtonOutline type="button" onClick={() => navigate(`/devices/${deviceId}/overview`)}>
            Cancel
          </ButtonOutline>
          <ButtonPrimary type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </ButtonPrimary>
        </div>
      </form>
    </div>
  )
}

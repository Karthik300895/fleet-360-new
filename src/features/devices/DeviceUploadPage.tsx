import { Link } from 'react-router-dom'
import styles from './DeviceUploadPage.module.css'

export function DeviceUploadPage() {
  return (
    <div className={styles.page}>
      <Link to="/devices" className={styles.back}>← Back to devices</Link>
      <h1 className={styles.title}>Upload Devices</h1>
      <p className={styles.copy}>
        Bulk XLSX upload UI (Story 2.3) — API layer is wired via `uploadApi` and MSW handlers.
      </p>
    </div>
  )
}

import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { UploadParseResult, UploadRow } from '../../entities/upload'
import { uploadApi } from '../../api/uploadApi'
import { ButtonOutline, ButtonPrimary } from '../../shared/ui'
import { useDeviceStore } from '../../stores/useDeviceStore'
import { downloadDeviceUploadTemplate } from './uploadTemplate'
import styles from './DeviceUploadPage.module.css'

export function DeviceUploadPage() {
  const navigate = useNavigate()
  const refresh = useDeviceStore((state) => state.refresh)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [parseResult, setParseResult] = useState<UploadParseResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [committing, setCommitting] = useState(false)

  function resetSession() {
    setFileName(null)
    setFileError(null)
    setParseResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  function validateFile(file: File): boolean {
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setFileError('Upload failed — only .xlsx files are accepted')
      return false
    }
    setFileError(null)
    setFileName(file.name)
    setParseResult(null)
    return true
  }

  function onFilesSelected(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    validateFile(file)
  }

  async function loadData() {
    const file = inputRef.current?.files?.[0]
    if (!file) {
      setFileError('Select an .xlsx file first.')
      return
    }
    if (!validateFile(file)) return
    setLoading(true)
    try {
      const result = await uploadApi.parse(file)
      setParseResult(result)
    } catch {
      setFileError('Unable to parse file. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function saveAndNext() {
    if (!parseResult || parseResult.rows.some((row) => !row.valid)) return
    setCommitting(true)
    try {
      await uploadApi.commit(parseResult.fileName)
      await refresh()
      navigate('/devices')
    } catch {
      setFileError('Unable to save devices. Please try again.')
    } finally {
      setCommitting(false)
    }
  }

  const allValid = parseResult?.rows.every((row) => row.valid) ?? false

  return (
    <div className={styles.page}>
      <Link to="/devices" className={styles.back} onClick={resetSession}>← Back</Link>
      <h1 className={styles.title}>Upload Devices</h1>

      <div
        className={[styles.dropzone, dragOver ? styles.dropzoneActive : ''].filter(Boolean).join(' ')}
        onDragOver={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragOver(false)
          onFilesSelected(event.dataTransfer.files)
          if (inputRef.current && event.dataTransfer.files[0]) {
            inputRef.current.files = event.dataTransfer.files
          }
        }}
      >
        <p className={styles.dropIcon} aria-hidden>☁️</p>
        <p>Drag and drop your file here</p>
        <button type="button" className={styles.browse} onClick={() => inputRef.current?.click()}>
          Browse
        </button>
        <p className={styles.formats}>Supported Formats: XLSX</p>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx"
          className={styles.hiddenInput}
          onChange={(event) => onFilesSelected(event.target.files)}
        />
      </div>

      <button
        type="button"
        className={styles.templateLink}
        onClick={() => void downloadDeviceUploadTemplate()}
      >
        Download Template
      </button>

      {fileName ? (
        <div className={styles.fileRow}>
          <span>{fileName}</span>
          <button type="button" aria-label="Remove file" onClick={resetSession}>×</button>
        </div>
      ) : null}

      {fileError ? <p className={styles.error} role="alert">{fileError}</p> : null}

      <div className={styles.actions}>
        <ButtonOutline type="button" onClick={() => navigate('/devices')}>Cancel</ButtonOutline>
        <ButtonPrimary type="button" onClick={() => void loadData()} disabled={!fileName || loading}>
          {loading ? 'Loading…' : 'Load Data'}
        </ButtonPrimary>
      </div>

      {parseResult ? (
        <div className={styles.results}>
          <h2 className={styles.resultsTitle}>Validation results</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Row</th>
                <th>Device</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {parseResult.rows.map((row: UploadRow) => (
                <tr key={row.rowNumber}>
                  <td>{row.rowNumber}</td>
                  <td>{row.deviceName}</td>
                  <td>{row.valid ? 'Ready' : 'Invalid'}</td>
                  <td>{row.errors.join(', ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ButtonPrimary
            type="button"
            disabled={!allValid || committing}
            onClick={() => void saveAndNext()}
          >
            {committing ? 'Saving…' : 'Save & Next'}
          </ButtonPrimary>
        </div>
      ) : null}
    </div>
  )
}

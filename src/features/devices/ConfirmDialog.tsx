import { ButtonOutline, ButtonPrimary } from '../../shared/ui'
import styles from './ConfirmDialog.module.css'

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className={styles.root} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <button type="button" className={styles.backdrop} aria-label="Cancel" onClick={onCancel} />
      <div className={styles.card}>
        <h2 id="confirm-title" className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <ButtonOutline type="button" onClick={onCancel}>Cancel</ButtonOutline>
          <ButtonPrimary type="button" onClick={onConfirm}>{confirmLabel}</ButtonPrimary>
        </div>
      </div>
    </div>
  )
}

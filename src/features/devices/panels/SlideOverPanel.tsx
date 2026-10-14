import { useEffect, type ReactNode } from 'react'
import styles from './SlideOverPanel.module.css'

type SlideOverPanelProps = {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export function SlideOverPanel({ title, open, onClose, children, footer }: SlideOverPanelProps) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.root}>
      <button type="button" className={styles.backdrop} aria-label="Close panel" onClick={onClose} />
      <aside className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="panel-title">
        <header className={styles.header}>
          <h2 id="panel-title" className={styles.title}>{title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </aside>
    </div>
  )
}

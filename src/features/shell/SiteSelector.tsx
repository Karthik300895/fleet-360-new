import { useEffect, useRef, useState } from 'react'
import {
  getSelectedSiteLabel,
  SITE_OPTIONS,
  type SiteId,
  useShellStore,
} from '../../stores/useShellStore'
import styles from './SiteSelector.module.css'

export function SiteSelector() {
  const selectedSiteId = useShellStore((state) => state.selectedSiteId)
  const setSelectedSiteId = useShellStore((state) => state.setSelectedSiteId)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocumentClick)
    return () => document.removeEventListener('mousedown', onDocumentClick)
  }, [])

  function selectSite(siteId: SiteId) {
    setSelectedSiteId(siteId)
    setOpen(false)
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{getSelectedSiteLabel(selectedSiteId)}</span>
        <span className={styles.chevron} aria-hidden>▼</span>
      </button>
      {open ? (
        <ul className={styles.menu} role="listbox">
          {SITE_OPTIONS.map((site) => (
            <li key={site.id}>
              <button
                type="button"
                role="option"
                aria-selected={site.id === selectedSiteId}
                className={site.id === selectedSiteId ? styles.optionActive : styles.option}
                onClick={() => selectSite(site.id)}
              >
                {site.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

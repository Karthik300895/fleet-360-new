import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { FleetLogo } from '../../shared/ui'
import { SiteSelector } from './SiteSelector'
import styles from './ApplicationShell.module.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', short: 'D' },
  { to: '/devices', label: 'Devices', short: 'Dv' },
  { to: '/sites', label: 'Sites', short: 'S' },
  { to: '/users', label: 'Users', short: 'U' },
  { to: '/alarms', label: 'Alarms', short: 'A' },
] as const

function isNavActive(path: string, pathname: string): boolean {
  if (path === '/devices') {
    return pathname === '/devices' || pathname.startsWith('/devices/')
  }
  return pathname === path || pathname.startsWith(`${path}/`)
}

export function ApplicationShell() {
  const { pathname } = useLocation()

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerStart}>
          <FleetLogo className={styles.logo} />
          <SiteSelector />
        </div>
        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={
                [styles.navLink, isNavActive(item.to, pathname) ? styles.navLinkActive : '']
                  .filter(Boolean)
                  .join(' ')
              }
            >
              <span className={styles.navIcon} aria-hidden>{item.short}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className={styles.utilities}>
          <button type="button" className={styles.iconButton} aria-label="Notifications">
            🔔
          </button>
          <button type="button" className={styles.avatar} aria-label="Profile">
            KR
          </button>
        </div>
      </header>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

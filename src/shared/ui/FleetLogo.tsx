import styles from './FleetLogo.module.css'

export type FleetLogoProps = {
  variant?: 'light' | 'dark'
  className?: string
}

export function FleetLogo({ variant = 'dark', className }: FleetLogoProps) {
  return (
    <span
      className={[styles.logo, variant === 'light' ? styles.light : styles.dark, className]
        .filter(Boolean)
        .join(' ')}
      aria-label="Fleet 360"
    >
      <span className={styles.fleet}>Fleet</span>
      <span className={styles.threeSixty}>360</span>
    </span>
  )
}

import type { HTMLAttributes } from 'react'
import styles from './BadgeOnline.module.css'

export type OnlineStatus = 'online' | 'offline'

export type BadgeOnlineProps = {
  status: OnlineStatus
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>

const STATUS_LABEL: Record<OnlineStatus, string> = {
  online: 'Online',
  offline: 'Offline',
}

export function BadgeOnline({ status, className, ...props }: BadgeOnlineProps) {
  const classes = [
    styles.badge,
    status === 'online' ? styles.online : styles.offline,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} {...props}>
      {STATUS_LABEL[status]}
    </span>
  )
}

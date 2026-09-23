import type { HTMLAttributes } from 'react'
import styles from './BadgeDeviceType.module.css'

export type DeviceType = 'cooler' | 'air' | 'water'

export type BadgeDeviceTypeProps = {
  type: DeviceType
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>

const TYPE_LABEL: Record<DeviceType, string> = {
  cooler: 'Cooler',
  air: 'Air',
  water: 'Water',
}

export function BadgeDeviceType({ type, className, ...props }: BadgeDeviceTypeProps) {
  const classes = [styles.badge, styles[type], className].filter(Boolean).join(' ')

  return (
    <span className={classes} {...props}>
      {TYPE_LABEL[type]}
    </span>
  )
}

import type { ComponentPropsWithoutRef } from 'react'
import styles from './ButtonOutline.module.css'
import focusStyles from './focus-ring.module.css'

export type ButtonOutlineProps = ComponentPropsWithoutRef<'button'>

export function ButtonOutline({
  className,
  children,
  type = 'button',
  ...props
}: ButtonOutlineProps) {
  const classes = [styles.button, focusStyles.focusRing, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}

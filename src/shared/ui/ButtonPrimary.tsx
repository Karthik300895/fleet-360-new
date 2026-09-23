import type { ComponentPropsWithoutRef } from 'react'
import styles from './ButtonPrimary.module.css'
import focusStyles from './focus-ring.module.css'

export type ButtonPrimaryProps = ComponentPropsWithoutRef<'button'>

export function ButtonPrimary({
  className,
  children,
  type = 'button',
  ...props
}: ButtonPrimaryProps) {
  const classes = [styles.button, focusStyles.focusRing, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}

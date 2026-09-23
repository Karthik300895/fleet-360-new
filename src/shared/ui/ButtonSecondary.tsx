import type { ComponentPropsWithoutRef } from 'react'
import styles from './ButtonSecondary.module.css'
import focusStyles from './focus-ring.module.css'

export type ButtonSecondaryProps = ComponentPropsWithoutRef<'button'>

export function ButtonSecondary({
  className,
  children,
  type = 'button',
  ...props
}: ButtonSecondaryProps) {
  const classes = [styles.button, focusStyles.focusRing, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}

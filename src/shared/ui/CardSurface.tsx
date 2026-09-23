import type { HTMLAttributes, ReactNode } from 'react'
import styles from './CardSurface.module.css'

export type CardSurfaceProps = {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export function CardSurface({ children, className, ...props }: CardSurfaceProps) {
  const classes = [styles.card, className].filter(Boolean).join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

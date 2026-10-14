import styles from './InsightCard.module.css'

export type InsightCardProps = {
  title?: string
  children: string
}

export function InsightCard({ title = 'Insight', children }: InsightCardProps) {
  return (
    <aside className={styles.card} aria-label={title}>
      <p className={styles.title}>{title}</p>
      <p className={styles.body}>{children}</p>
    </aside>
  )
}

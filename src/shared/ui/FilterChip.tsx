import styles from './FilterChip.module.css'

export type FilterChipProps = {
  label: string
  pressed: boolean
  onToggle: () => void
}

export function FilterChip({ label, pressed, onToggle }: FilterChipProps) {
  return (
    <button
      type="button"
      className={[styles.chip, pressed ? styles.pressed : ''].filter(Boolean).join(' ')}
      aria-pressed={pressed}
      onClick={onToggle}
    >
      {label}
    </button>
  )
}

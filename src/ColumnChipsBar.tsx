type ColumnChip = {
  field: string
  label: string
}

type ColumnChipsBarProps = {
  groupedColumns: ColumnChip[]
  hiddenColumns: ColumnChip[]
  onRemoveGroup: (field: string) => void
  onRestoreHidden: (field: string) => void
}

export default function ColumnChipsBar({
  groupedColumns,
  hiddenColumns,
  onRemoveGroup,
  onRestoreHidden,
}: ColumnChipsBarProps) {
  if (groupedColumns.length === 0 && hiddenColumns.length === 0) return null

  return (
    <div className="column-chips-stack">
      {groupedColumns.length > 0 && (
        <div className="column-chips-bar column-chips-bar--group" role="region" aria-label="Grouped columns">
          <span className="column-chips-label">Grouped by</span>
          <div className="column-chips-list">
            {groupedColumns.map(({ field, label }) => (
              <span key={`group-${field}`} className="column-chip column-chip--group">
                <span className="column-chip-label">{label}</span>
                <button
                  type="button"
                  className="column-chip-close"
                  aria-label={`Remove grouping by ${label}`}
                  onClick={() => onRemoveGroup(field)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {hiddenColumns.length > 0 && (
        <div className="column-chips-bar" role="region" aria-label="Hidden columns">
          <span className="column-chips-label">Hidden columns</span>
          <div className="column-chips-list">
            {hiddenColumns.map(({ field, label }) => (
              <span key={`hidden-${field}`} className="column-chip">
                <span className="column-chip-label">{label}</span>
                <button
                  type="button"
                  className="column-chip-close"
                  aria-label={`Restore ${label} column`}
                  onClick={() => onRestoreHidden(field)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

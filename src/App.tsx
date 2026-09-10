import { useCallback, useMemo, useRef, useState } from 'react'
import ColumnChipsBar from './ColumnChipsBar'
import TabulatorGrid, { type TabulatorGridHandle } from './TabulatorGrid'
import {
  DEFAULT_PINNED_COLUMNS,
  INITIAL_TABLE_DATA,
  TABLE_CONFIGS,
  TABLE_VIEW_ORDER,
  getColumnLabel,
  getColumnVisibilityDefaults,
  getGroupableFields,
  type TableViewId,
} from './mockData'
import './App.css'

function App() {
  const gridRef = useRef<TabulatorGridHandle>(null)
  const [activeView, setActiveView] = useState<TableViewId>('users')
  const [tableData, setTableData] = useState(INITIAL_TABLE_DATA)
  const [pinnedColumns, setPinnedColumns] = useState(DEFAULT_PINNED_COLUMNS)
  const [groupColumns, setGroupColumns] = useState<Record<TableViewId, string[]>>({
    users: [],
    orders: [],
    inventory: [],
  })
  const [showPinnedTop, setShowPinnedTop] = useState(true)
  const [showPinnedBottom, setShowPinnedBottom] = useState(true)
  const [quickFilter, setQuickFilter] = useState('')
  const [showColumnPanel, setShowColumnPanel] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<
    Record<TableViewId, Record<string, boolean>>
  >({
    users: getColumnVisibilityDefaults('users'),
    orders: getColumnVisibilityDefaults('orders'),
    inventory: getColumnVisibilityDefaults('inventory'),
  })

  const config = TABLE_CONFIGS[activeView]
  const rowData = tableData[activeView]
  const activePinned = pinnedColumns[activeView]
  const activeGroups = groupColumns[activeView]

  const hiddenFields = useMemo(
    () =>
      config.columns
        .map((column) => column.field)
        .filter((field) => !columnVisibility[activeView][field]),
    [activeView, columnVisibility, config.columns],
  )

  const gridHiddenFields = useMemo(
    () => [...new Set([...hiddenFields, ...activeGroups])],
    [hiddenFields, activeGroups],
  )

  const hiddenColumns = useMemo(
    () =>
      hiddenFields
        .filter((field) => !activeGroups.includes(field))
        .map((field) => ({ field, label: getColumnLabel(activeView, field) })),
    [activeGroups, activeView, hiddenFields],
  )

  const groupedColumnChips = useMemo(
    () => activeGroups.map((field) => ({ field, label: getColumnLabel(activeView, field) })),
    [activeGroups, activeView],
  )

  const setColumnVisible = (field: string, visible: boolean) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [activeView]: { ...prev[activeView], [field]: visible },
    }))
    if (visible) {
      gridRef.current?.showColumn(field)
    } else {
      gridRef.current?.hideColumn(field)
    }
  }

  const handleToggleColumnVisibility = (field: string) => {
    setColumnVisible(field, !columnVisibility[activeView][field])
  }

  const handleRestoreColumn = (field: string) => {
    setColumnVisible(field, true)
  }

  const handleColumnDragOut = useCallback(
    (field: string) => {
      if (!columnVisibility[activeView][field]) return

      if (activeGroups.includes(field)) {
        setGroupColumns((prev) => {
          const nextGroups = prev[activeView].filter((col) => col !== field)
          gridRef.current?.setGroupBy(nextGroups)
          return { ...prev, [activeView]: nextGroups }
        })
      }

      if (activePinned.includes(field)) {
        setPinnedColumns((prev) => ({
          ...prev,
          [activeView]: prev[activeView].filter((col) => col !== field),
        }))
      }

      setColumnVisible(field, false)
    },
    [activeGroups, activePinned, activeView, columnVisibility],
  )

  const handleToggleColumnPin = (field: string) => {
    setPinnedColumns((prev) => {
      const current = prev[activeView]
      const isPinned = current.includes(field)
      const nextPinned = isPinned ? current.filter((col) => col !== field) : [...current, field]
      return { ...prev, [activeView]: nextPinned }
    })
  }

  const handleToggleColumnGroup = (field: string) => {
    setGroupColumns((prev) => {
      const current = prev[activeView]
      const isGrouped = current.includes(field)
      const nextGroups = isGrouped
        ? current.filter((col) => col !== field)
        : [...current, field]

      gridRef.current?.setGroupBy(nextGroups)
      if (!isGrouped) {
        gridRef.current?.hideColumn(field)
      } else {
        gridRef.current?.showColumn(field)
      }

      return { ...prev, [activeView]: nextGroups }
    })
  }

  const handleRemoveGroup = (field: string) => {
    setGroupColumns((prev) => {
      const nextGroups = prev[activeView].filter((col) => col !== field)
      gridRef.current?.setGroupBy(nextGroups)
      gridRef.current?.showColumn(field)
      return { ...prev, [activeView]: nextGroups }
    })
  }

  const handleDeleteSelected = () => {
    const selectedRows = gridRef.current?.deleteSelected() ?? []
    if (selectedRows.length === 0) {
      window.alert('Select one or more rows to delete.')
      return
    }

    const idField = config.idField
    const selectedIds = new Set(selectedRows.map((row) => String((row as Record<string, unknown>)[idField])))
    setTableData((prev) => ({
      ...prev,
      [activeView]: prev[activeView].filter(
        (row) => !selectedIds.has(String((row as Record<string, unknown>)[idField])),
      ),
    }))
  }

  const handleAddRecord = () => {
    const newRow = config.createEmptyRow()
    gridRef.current?.addRow(newRow)
    setTableData((prev) => ({
      ...prev,
      [activeView]: [newRow, ...prev[activeView]],
    }))
  }

  const handleSwitchView = (viewId: TableViewId) => {
    setActiveView(viewId)
    setQuickFilter('')
    setShowColumnPanel(false)
  }

  const pinnedLabels = activePinned.map((field) => getColumnLabel(activeView, field))
  const groupableFields = getGroupableFields(activeView)
  const topSummary = config.pinnedTopRow()
  const bottomSummary = config.pinnedBottomRow()

  return (
    <div className="grid-poc">
      <header className="grid-poc-header">
        <div>
          <p className="grid-poc-eyebrow">Tabulator React POC</p>
          <h1 className="grid-poc-title">Fleet 360 — Dynamic Data Tables</h1>
          <p className="grid-poc-subtitle">
            Pin columns to the left (currently:{' '}
            <strong>{pinnedLabels.length ? pinnedLabels.join(', ') : 'none'}</strong>). Drag a
            column header outside the table to hide it, or use the Columns panel — hidden columns
            appear as chips above the grid. Click × on a chip to restore.
          </p>
        </div>
      </header>

      <nav className="table-tabs" aria-label="Table views">
        {TABLE_VIEW_ORDER.map((viewId) => (
          <button
            key={viewId}
            type="button"
            className={`table-tab ${activeView === viewId ? 'table-tab--active' : ''}`}
            onClick={() => handleSwitchView(viewId)}
          >
            {TABLE_CONFIGS[viewId].label}
          </button>
        ))}
      </nav>

      <section className="action-bar">
        <div className="action-group">
          <input
            type="search"
            className="search-input"
            placeholder="Quick search all columns…"
            value={quickFilter}
            onChange={(event) => setQuickFilter(event.target.value)}
            aria-label="Quick filter"
          />
        </div>

        <div className="action-group">
          <button type="button" className="btn btn-primary" onClick={handleAddRecord}>
            Add New Record
          </button>
          <button type="button" className="btn btn-danger" onClick={handleDeleteSelected}>
            Delete Selected Rows
          </button>
        </div>

        <div className="action-group">
          <button
            type="button"
            className={`btn ${showPinnedTop ? 'btn-active' : 'btn-secondary'}`}
            onClick={() => setShowPinnedTop((value) => !value)}
          >
            {showPinnedTop ? 'Hide Top Summary Row' : 'Show Top Summary Row'}
          </button>
          <button
            type="button"
            className={`btn ${showPinnedBottom ? 'btn-active' : 'btn-secondary'}`}
            onClick={() => setShowPinnedBottom((value) => !value)}
          >
            {showPinnedBottom ? 'Hide Bottom Summary Row' : 'Show Bottom Summary Row'}
          </button>
        </div>

        <div className="action-group column-panel-wrap">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowColumnPanel((value) => !value)}
            aria-expanded={showColumnPanel}
          >
            Columns
          </button>
          {showColumnPanel && (
            <div className="column-panel" role="group" aria-label="Column visibility, pinning, and grouping">
              <div className="column-panel-head">
                <span>Column</span>
                <span>Show</span>
                <span>Pin</span>
                <span>Group</span>
              </div>
              {config.columns.map((column) => {
                const { field, title } = column
                const isVisible = columnVisibility[activeView][field]
                const isPinned = activePinned.includes(field)
                const isGrouped = activeGroups.includes(field)
                const canGroup = groupableFields.includes(field)

                return (
                  <div key={field} className="column-panel-row">
                    <span className="column-panel-name">{title}</span>
                    <label className="column-panel-toggle">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        disabled={isGrouped}
                        onChange={() => handleToggleColumnVisibility(field)}
                        aria-label={`Show ${title}`}
                      />
                    </label>
                    <label className="column-panel-toggle">
                      <input
                        type="checkbox"
                        checked={isPinned}
                        disabled={!isVisible || isGrouped}
                        onChange={() => handleToggleColumnPin(field)}
                        aria-label={`Pin ${title} to left`}
                      />
                    </label>
                    <label className="column-panel-toggle">
                      <input
                        type="checkbox"
                        checked={isGrouped}
                        disabled={!canGroup}
                        onChange={() => handleToggleColumnGroup(field)}
                        aria-label={`Group by ${title}`}
                      />
                    </label>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <div className="column-drop-hint" aria-hidden="true">
        Drag a column header outside the table to hide it
      </div>

      <ColumnChipsBar
        groupedColumns={groupedColumnChips}
        hiddenColumns={hiddenColumns}
        onRemoveGroup={handleRemoveGroup}
        onRestoreHidden={handleRestoreColumn}
      />

      <section className="grid-section">
        {showPinnedTop && (
          <div className="summary-row summary-row--top">
            {Object.entries(topSummary)
              .slice(0, 4)
              .map(([key, value]) => (
                <span key={key} className="summary-item">
                  <strong>{getColumnLabel(activeView, key)}:</strong> {String(value)}
                </span>
              ))}
          </div>
        )}

        <TabulatorGrid
          ref={gridRef}
          viewId={activeView}
          data={rowData}
          pinnedFields={activePinned}
          groupFields={activeGroups}
          hiddenFields={gridHiddenFields}
          quickFilter={quickFilter}
          onColumnDragOut={handleColumnDragOut}
        />

        {showPinnedBottom && (
          <div className="summary-row summary-row--bottom">
            {Object.entries(bottomSummary)
              .slice(0, 4)
              .map(([key, value]) => (
                <span key={key} className="summary-item">
                  <strong>{getColumnLabel(activeView, key)}:</strong> {String(value)}
                </span>
              ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default App

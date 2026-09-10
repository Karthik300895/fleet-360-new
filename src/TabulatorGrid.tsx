import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import type { TabulatorFull, GroupArg } from 'tabulator-tables'
import {
  buildTabulatorColumns,
  getRowLabel,
  type TableRow,
  type TableViewId,
} from './mockData'

import 'tabulator-tables/dist/css/tabulator.min.css'

export type TabulatorGridHandle = {
  hideColumn: (field: string) => void
  showColumn: (field: string) => void
  setGroupBy: (fields: string[]) => void
  deleteSelected: () => TableRow[]
  addRow: (row: TableRow) => void
}

type TabulatorGridProps = {
  viewId: TableViewId
  data: TableRow[]
  pinnedFields: string[]
  groupFields: string[]
  hiddenFields: string[]
  quickFilter: string
  onColumnDragOut?: (field: string) => void
}

const NON_REMOVABLE_FIELDS = new Set(['actions'])

function isPointerInsideRect(clientX: number, clientY: number, rect: DOMRect) {
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  )
}

function setupColumnDragOut(
  container: HTMLElement,
  tableElement: HTMLElement,
  onColumnDragOut: (field: string) => void,
) {
  let draggingField: string | null = null
  let dragStarted = false
  let startX = 0
  let startY = 0
  const dragThreshold = 6

  const getFieldFromHeader = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return null
    if (target.closest('input, button, .tabulator-header-filter')) return null

    const header = target.closest('.tabulator-col[tabulator-field]') as HTMLElement | null
    const field = header?.getAttribute('tabulator-field')
    if (!field || NON_REMOVABLE_FIELDS.has(field)) return null
    return field
  }

  const setDragVisual = (active: boolean) => {
    container.classList.toggle('column-drag-active', active)
  }

  const resetDrag = () => {
    draggingField = null
    dragStarted = false
    setDragVisual(false)
  }

  const finishDragOutside = (clientX: number, clientY: number) => {
    if (!draggingField || !dragStarted) {
      resetDrag()
      return
    }

    const tableRect = tableElement.getBoundingClientRect()
    const droppedOutside = !isPointerInsideRect(clientX, clientY, tableRect)

    if (droppedOutside) {
      window.setTimeout(() => {
        onColumnDragOut(draggingField as string)
      }, 0)
    }

    resetDrag()
  }

  const handleMouseDown = (event: MouseEvent) => {
    if (event.button !== 0) return
    const field = getFieldFromHeader(event.target)
    if (!field) return

    draggingField = field
    dragStarted = false
    startX = event.clientX
    startY = event.clientY
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!draggingField || dragStarted) return

    const dx = Math.abs(event.clientX - startX)
    const dy = Math.abs(event.clientY - startY)
    if (dx > dragThreshold || dy > dragThreshold) {
      dragStarted = true
      setDragVisual(true)
    }
  }

  const handleMouseUp = (event: MouseEvent) => {
    finishDragOutside(event.clientX, event.clientY)
  }

  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.changedTouches[0]
    if (!touch) return
    const field = getFieldFromHeader(event.target)
    if (!field) return

    draggingField = field
    dragStarted = false
    startX = touch.clientX
    startY = touch.clientY
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!draggingField || dragStarted) return
    const touch = event.changedTouches[0]
    if (!touch) return

    const dx = Math.abs(touch.clientX - startX)
    const dy = Math.abs(touch.clientY - startY)
    if (dx > dragThreshold || dy > dragThreshold) {
      dragStarted = true
      setDragVisual(true)
    }
  }

  const handleTouchEnd = (event: TouchEvent) => {
    const touch = event.changedTouches[0]
    if (!touch) return
    finishDragOutside(touch.clientX, touch.clientY)
  }

  container.addEventListener('mousedown', handleMouseDown)
  container.addEventListener('touchstart', handleTouchStart, { passive: true })
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('touchmove', handleTouchMove, { passive: true })
  document.addEventListener('touchend', handleTouchEnd, { passive: true })

  return () => {
    container.removeEventListener('mousedown', handleMouseDown)
    container.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
  }
}

const TabulatorGrid = forwardRef<TabulatorGridHandle, TabulatorGridProps>(function TabulatorGrid(
  { viewId, data, pinnedFields, groupFields, hiddenFields, quickFilter, onColumnDragOut },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<TabulatorFull | null>(null)
  const onColumnDragOutRef = useRef(onColumnDragOut)
  const [tableReady, setTableReady] = useState(false)

  onColumnDragOutRef.current = onColumnDragOut

  const runWhenReady = (action: (table: TabulatorFull) => void) => {
    const table = tableRef.current
    if (!table || !tableReady) return
    action(table)
  }

  useImperativeHandle(ref, () => ({
    hideColumn(field: string) {
      runWhenReady((table) => {
        table.hideColumn(field)
      })
    },
    showColumn(field: string) {
      runWhenReady((table) => {
        table.showColumn(field)
      })
    },
    setGroupBy(fields: string[]) {
      runWhenReady((table) => {
        const groups = (fields.length ? fields : false) as GroupArg
        table.setGroupBy(groups)
      })
    },
    deleteSelected() {
      const table = tableRef.current
      if (!table || !tableReady) return []
      const selected = table.getSelectedData() as TableRow[]
      selected.forEach((row) => {
        const match = table.getRows().find((tableRow) => tableRow.getData() === row)
        match?.delete()
      })
      return selected
    },
    addRow(row: TableRow) {
      runWhenReady((table) => {
        table.addRow(row, true)
      })
    },
  }))

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    setTableReady(false)

    let cancelled = false

    const table = new Tabulator(element, {
      data,
      layout: 'fitDataFill',
      height: '100%',
      selectableRows: true,
      movableColumns: true,
      resizableColumnFit: true,
      groupBy: groupFields.length ? groupFields : undefined,
      groupHeader: (value, count) => `${value} <span class="group-count">(${count})</span>`,
      columns: buildTabulatorColumns(viewId, pinnedFields, hiddenFields),
      placeholder: 'No records to display',
    })

    let removeDragOutListener: (() => void) | undefined

    table.on('tableBuilt', () => {
      if (cancelled) return
      setTableReady(true)

      if (onColumnDragOutRef.current) {
        const tableElement = element.querySelector('.tabulator') as HTMLElement | null
        if (tableElement) {
          removeDragOutListener = setupColumnDragOut(element, tableElement, (field) => {
            onColumnDragOutRef.current?.(field)
          })
        }
      }
    })

    table.on('cellClick', (_event, cell) => {
      if (cell.getColumn().getField() !== 'actions') return
      const row = cell.getData() as TableRow
      window.alert(`View details for ${getRowLabel(row)}`)
    })

    tableRef.current = table

    return () => {
      cancelled = true
      removeDragOutListener?.()
      setTableReady(false)
      tableRef.current = null
      table.destroy()
    }
    // Recreate the grid only when switching table views.
  }, [viewId])

  useEffect(() => {
    if (!tableReady) return
    tableRef.current?.setData(data)
  }, [data, tableReady])

  useEffect(() => {
    if (!tableReady) return
    const groups = (groupFields.length ? groupFields : false) as GroupArg
    tableRef.current?.setGroupBy(groups)
  }, [groupFields, tableReady])

  useEffect(() => {
    if (!tableReady) return
    tableRef.current?.setColumns(buildTabulatorColumns(viewId, pinnedFields, hiddenFields))
  }, [viewId, pinnedFields, hiddenFields, tableReady])

  useEffect(() => {
    if (!tableReady) return
    const table = tableRef.current
    if (!table) return

    if (!quickFilter.trim()) {
      table.clearFilter(true)
      return
    }

    const term = quickFilter.trim().toLowerCase()
    table.setFilter((row) =>
      Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(term)),
    )
  }, [quickFilter, tableReady])

  return <div ref={containerRef} className="tabulator-shell" />
})

export default TabulatorGrid

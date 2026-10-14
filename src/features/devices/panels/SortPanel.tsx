import type { DeviceSortField } from '../../../entities/deviceSort'
import { DEFAULT_DEVICE_SORT } from '../../../entities/deviceSort'
import { ButtonOutline, ButtonPrimary } from '../../../shared/ui'
import { useDeviceListUiStore } from '../../../stores/useDeviceListUiStore'
import { SlideOverPanel } from './SlideOverPanel'
import styles from './SortPanel.module.css'

const SORT_FIELDS: Array<{ value: DeviceSortField; label: string }> = [
  { value: 'name', label: 'Device Name' },
  { value: 'serialNumber', label: 'Serial Number' },
  { value: 'macAddress', label: 'MAC Address' },
  { value: 'meetingSetpoint', label: 'Meeting Setpoint' },
  { value: 'heatingHours', label: 'Heating Hours' },
  { value: 'coolingHours', label: 'Cooling Hours' },
]

export function SortPanel() {
  const open = useDeviceListUiStore((state) => state.sortOpen)
  const closeSort = useDeviceListUiStore((state) => state.closeSort)
  const draftSort = useDeviceListUiStore((state) => state.draftSort)
  const setDraftSort = useDeviceListUiStore((state) => state.setDraftSort)
  const resetDraftSort = useDeviceListUiStore((state) => state.resetDraftSort)
  const applySort = useDeviceListUiStore((state) => state.applySort)

  return (
    <SlideOverPanel
      title="Sort"
      open={open}
      onClose={closeSort}
      footer={
        <>
          <ButtonOutline type="button" onClick={() => setDraftSort(DEFAULT_DEVICE_SORT)}>
            Reset
          </ButtonOutline>
          <ButtonOutline type="button" onClick={resetDraftSort}>Cancel</ButtonOutline>
          <ButtonPrimary type="button" onClick={applySort}>Apply</ButtonPrimary>
        </>
      }
    >
      <fieldset className={styles.fieldset}>
        <legend>Order</legend>
        <label className={styles.radio}>
          <input
            type="radio"
            name="sort-direction"
            checked={draftSort.direction === 'asc'}
            onChange={() => setDraftSort({ ...draftSort, direction: 'asc' })}
          />
          Ascending
        </label>
        <label className={styles.radio}>
          <input
            type="radio"
            name="sort-direction"
            checked={draftSort.direction === 'desc'}
            onChange={() => setDraftSort({ ...draftSort, direction: 'desc' })}
          />
          Descending
        </label>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Sort by</legend>
        {SORT_FIELDS.map((field) => (
          <label key={field.value} className={styles.radio}>
            <input
              type="radio"
              name="sort-field"
              checked={draftSort.field === field.value}
              onChange={() => setDraftSort({ ...draftSort, field: field.value })}
            />
            {field.label}
          </label>
        ))}
      </fieldset>
    </SlideOverPanel>
  )
}

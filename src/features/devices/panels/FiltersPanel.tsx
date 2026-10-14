import type { Device } from '../../../entities/device'
import type { DevicePanelFilters } from '../../../entities/deviceFilter'
import type { DeviceType } from '../../../entities/device'
import { ButtonOutline, ButtonPrimary, FilterChip } from '../../../shared/ui'
import { useDeviceListUiStore } from '../../../stores/useDeviceListUiStore'
import { SlideOverPanel } from './SlideOverPanel'
import styles from './FiltersPanel.module.css'

const CONNECTION_OPTIONS = ['online', 'offline'] as const
const TYPE_OPTIONS: DeviceType[] = ['air', 'water', 'cooler']
const POWER_OPTIONS = ['on', 'off'] as const

type FiltersPanelProps = {
  devices: Device[]
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

function toggleChip<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

export function FiltersPanel({ devices }: FiltersPanelProps) {
  const open = useDeviceListUiStore((state) => state.filtersOpen)
  const closeFilters = useDeviceListUiStore((state) => state.closeFilters)
  const draft = useDeviceListUiStore((state) => state.draftFilters)
  const setDraftFilters = useDeviceListUiStore((state) => state.setDraftFilters)
  const clearDraftFilters = useDeviceListUiStore((state) => state.clearDraftFilters)
  const applyFilters = useDeviceListUiStore((state) => state.applyFilters)

  const locations = uniqueSorted(devices.map((device) => device.siteName))
  const floors = uniqueSorted(
    devices
      .filter((device) => !draft.location || device.siteName === draft.location)
      .map((device) => device.floor),
  )
  const areas = uniqueSorted(
    devices
      .filter((device) => !draft.location || device.siteName === draft.location)
      .filter((device) => !draft.floor || device.floor === draft.floor)
      .map((device) => device.area),
  )
  const modes = uniqueSorted(devices.map((device) => device.modeLabel))

  function patch(partial: Partial<DevicePanelFilters>) {
    setDraftFilters({ ...draft, ...partial })
  }

  return (
    <SlideOverPanel
      title="Filters"
      open={open}
      onClose={closeFilters}
      footer={
        <>
          <ButtonOutline type="button" onClick={clearDraftFilters}>Clear all</ButtonOutline>
          <ButtonPrimary type="button" onClick={applyFilters}>Apply</ButtonPrimary>
        </>
      }
    >
      <label className={styles.label}>
        Location
        <select
          className={styles.select}
          value={draft.location}
          onChange={(event) => patch({ location: event.target.value, floor: '', area: '' })}
        >
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Floor
        <select
          className={styles.select}
          value={draft.floor}
          onChange={(event) => patch({ floor: event.target.value, area: '' })}
        >
          <option value="">All floors</option>
          {floors.map((floor) => (
            <option key={floor} value={floor}>{floor}</option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Area
        <select
          className={styles.select}
          value={draft.area}
          onChange={(event) => patch({ area: event.target.value })}
        >
          <option value="">All areas</option>
          {areas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </label>

      <fieldset className={styles.fieldset}>
        <legend>Connection</legend>
        <div className={styles.chips}>
          {CONNECTION_OPTIONS.map((option) => (
            <FilterChip
              key={option}
              label={option === 'online' ? 'Online' : 'Offline'}
              pressed={draft.connections.includes(option)}
              onToggle={() => patch({ connections: toggleChip(draft.connections, option) })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Device type</legend>
        <div className={styles.chips}>
          {TYPE_OPTIONS.map((option) => (
            <FilterChip
              key={option}
              label={option.charAt(0).toUpperCase() + option.slice(1)}
              pressed={draft.types.includes(option)}
              onToggle={() => patch({ types: toggleChip(draft.types, option) })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Power</legend>
        <div className={styles.chips}>
          {POWER_OPTIONS.map((option) => (
            <FilterChip
              key={option}
              label={option === 'on' ? 'On' : 'Off'}
              pressed={draft.power.includes(option)}
              onToggle={() => patch({ power: toggleChip(draft.power, option) })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Mode</legend>
        <div className={styles.chips}>
          {modes.map((mode) => (
            <FilterChip
              key={mode}
              label={mode}
              pressed={draft.modes.includes(mode)}
              onToggle={() => patch({ modes: toggleChip(draft.modes, mode) })}
            />
          ))}
        </div>
      </fieldset>
    </SlideOverPanel>
  )
}

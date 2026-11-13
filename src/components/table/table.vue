<script lang="ts">
export interface TableColumn {
  prop?: string
  label?: string
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  sortable?: boolean
  ellipsis?: boolean
  slot?: string
  formatter?: (row: any, column: TableColumn, index: number) => string
  type?: 'selection' | 'index'
}

export interface SortState {
  prop: string
  order: 'asc' | 'desc' | null
}

export interface TableProps {
  data?: any[]
  columns?: TableColumn[]
  rowKey?: string
  border?: boolean
  striped?: boolean
  height?: number | string
  emptyText?: string
  highlightCurrentRow?: boolean
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MomoIcon from '../icon/icon.vue'
import { addUnit } from '../../utils/dom'

defineOptions({ name: 'MomoTable' })

const props = withDefaults(defineProps<TableProps>(), {
  data: () => [],
  columns: () => [],
  rowKey: '',
  border: false,
  striped: false,
  emptyText: '暂无数据',
  highlightCurrentRow: false,
})

const emit = defineEmits<{
  'selection-change': [rows: any[]]
  'row-click': [row: any, index: number]
  'sort-change': [state: SortState]
}>()

const sortState = ref<SortState>({ prop: '', order: null })
const selectedRows = ref<any[]>([])
const currentRow = ref<any>(null)

const hasSelection = computed(() => props.columns.some((col) => col.type === 'selection'))

const sortedData = computed(() => {
  const { prop, order } = sortState.value
  if (!prop || !order) return props.data
  return [...props.data].sort((a, b) => {
    const av = a?.[prop]
    const bv = b?.[prop]
    if (av === bv) return 0
    const result = av > bv ? 1 : -1
    return order === 'asc' ? result : -result
  })
})

const selectableRows = computed(() =>
  sortedData.value.filter((row) => !row?.disabled),
)

const isAllSelected = computed(
  () =>
    selectableRows.value.length > 0 &&
    selectableRows.value.every((row) => selectedRows.value.includes(row)),
)

const isIndeterminate = computed(
  () =>
    selectedRows.value.length > 0 &&
    selectedRows.value.length < selectableRows.value.length,
)

const tableStyle = computed(() =>
  props.height ? { height: addUnit(props.height) } : undefined,
)

function rowKeyOf(row: any, index: number): string | number {
  if (props.rowKey && row?.[props.rowKey] !== undefined) return row[props.rowKey]
  return index
}

function isRowSelected(row: any) {
  return selectedRows.value.includes(row)
}

function toggleRow(row: any, checked: boolean) {
  if (row?.disabled) return
  const next = checked
    ? [...selectedRows.value, row]
    : selectedRows.value.filter((item) => item !== row)
  selectedRows.value = next
  emit('selection-change', next)
}

function toggleAll(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  selectedRows.value = checked ? [...selectableRows.value] : []
  emit('selection-change', selectedRows.value)
}

function toggleSort(column: TableColumn) {
  if (!column.sortable || !column.prop) return
  if (sortState.value.prop !== column.prop) {
    sortState.value = { prop: column.prop, order: 'asc' }
  } else if (sortState.value.order === 'asc') {
    sortState.value = { prop: column.prop, order: 'desc' }
  } else {
    sortState.value = { prop: column.prop, order: null }
  }
  emit('sort-change', sortState.value)
}

function formatCell(row: any, column: TableColumn, index: number): string {
  if (column.formatter) return column.formatter(row, column, index)
  if (!column.prop) return ''
  const value = column.prop
    .split('.')
    .reduce((obj: any, key) => (obj == null ? undefined : obj[key]), row)
  return value === undefined || value === null ? '' : String(value)
}

function handleRowClick(row: any, index: number) {
  currentRow.value = row
  emit('row-click', row, index)
}

function clearSelection() {
  selectedRows.value = []
  emit('selection-change', [])
}

defineExpose({ selectedRows, clearSelection, currentRow })
</script>

<template>
  <div
    class="momo-table"
    :class="{ 'is-border': border, 'is-striped': striped }"
    :style="tableStyle"
  >
    <div class="momo-table__inner momo-scrollbar">
      <table>
        <colgroup>
          <col
            v-for="(column, index) in columns"
            :key="index"
            :style="{
              width: addUnit(column.width),
              minWidth: addUnit(column.minWidth),
            }"
          />
        </colgroup>
        <thead>
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              :class="[
                column.sortable && 'is-sortable',
                column.align && `is-align-${column.align}`,
              ]"
              :style="{ textAlign: column.headerAlign ?? column.align }"
              @click="toggleSort(column)"
            >
              <template v-if="column.type === 'selection'">
                <label class="momo-table__checkbox">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    :indeterminate.prop="isIndeterminate"
                    @change="toggleAll"
                  />
                  <span class="momo-table__checkbox-box">
                    <span class="momo-table__checkbox-mark" />
                  </span>
                </label>
              </template>
              <template v-else>
                <span class="momo-table__label">{{ column.label }}</span>
                <span v-if="column.sortable" class="momo-table__sorters">
                  <MomoIcon
                    name="chevron-up"
                    :size="10"
                    :class="{
                      'is-active':
                        sortState.prop === column.prop &&
                        sortState.order === 'asc',
                    }"
                  />
                  <MomoIcon
                    name="chevron-down"
                    :size="10"
                    :class="{
                      'is-active':
                        sortState.prop === column.prop &&
                        sortState.order === 'desc',
                    }"
                  />
                </span>
              </template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in sortedData"
            :key="rowKeyOf(row, rowIndex)"
            :class="{ 'is-current': highlightCurrentRow && currentRow === row }"
            @click="handleRowClick(row, rowIndex)"
          >
            <td
              v-for="(column, colIndex) in columns"
              :key="colIndex"
              :class="[
                column.align && `is-align-${column.align}`,
                column.ellipsis && 'is-ellipsis',
              ]"
            >
              <template v-if="column.type === 'selection'">
                <label class="momo-table__checkbox" @click.stop>
                  <input
                    type="checkbox"
                    :checked="isRowSelected(row)"
                    :disabled="row?.disabled"
                    @change="
                      toggleRow(
                        row,
                        ($event.target as HTMLInputElement).checked,
                      )
                    "
                  />
                  <span class="momo-table__checkbox-box">
                    <span class="momo-table__checkbox-mark" />
                  </span>
                </label>
              </template>
              <template v-else-if="column.type === 'index'">
                {{ rowIndex + 1 }}
              </template>
              <slot
                v-else-if="column.slot"
                :name="column.slot"
                :row="row"
                :column="column"
                :index="rowIndex"
              >
                {{ formatCell(row, column, rowIndex) }}
              </slot>
              <template v-else>
                {{ formatCell(row, column, rowIndex) }}
              </template>
            </td>
          </tr>
          <tr v-if="!sortedData.length">
            <td :colspan="columns.length || 1">
              <div class="momo-table__empty">
                <slot name="empty">{{ emptyText }}</slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
.momo-table {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--momo-bg-card);
  border: var(--momo-border-width) solid var(--momo-border-color);
  border-radius: var(--momo-radius-lg);
  box-shadow: var(--momo-shadow-base);

  &__inner {
    width: 100%;
    height: 100%;
    overflow: auto;

    &:not([style*='height']) {
      max-height: none;
    }
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 12px 14px;
    font-size: var(--momo-font-size-sm);
    font-weight: 700;
    color: var(--momo-text-regular);
    text-align: left;
    white-space: nowrap;
    background: var(--momo-bg-soft);
    border-bottom: var(--momo-border-width) solid var(--momo-border-color);

    &.is-sortable {
      cursor: pointer;
      user-select: none;
    }
  }

  td {
    padding: 11px 14px;
    font-size: var(--momo-font-size-base);
    border-bottom: 1.5px solid var(--momo-border-soft);
    transition: background 0.12s;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover td {
    background: var(--momo-bg-hover);
  }

  &.is-striped tbody tr:nth-child(even) td {
    background: var(--momo-bg-soft);
  }

  &.is-striped tbody tr:nth-child(even):hover td {
    background: var(--momo-bg-hover);
  }

  &.is-border {
    th + th,
    td + td {
      border-left: 1.5px solid var(--momo-border-soft);
    }
  }

  tbody tr.is-current td {
    background: var(--momo-color-primary-soft);
  }

  &__label {
    vertical-align: middle;
  }

  &__sorters {
    display: inline-flex;
    flex-direction: column;
    gap: 1px;
    margin-left: 4px;
    color: var(--momo-text-placeholder);
    vertical-align: middle;

    .momo-icon.is-active {
      color: var(--momo-color-primary);
    }
  }

  &__empty {
    padding: 44px 0;
    color: var(--momo-text-placeholder);
    text-align: center;
  }

  .is-align-center {
    text-align: center;
  }

  .is-align-right {
    text-align: right;
  }

  .is-ellipsis {
    max-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__checkbox {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;

    input {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;
    }
  }

  &__checkbox-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-xs);
    box-shadow: var(--momo-shadow-xs);
    transition: var(--momo-transition);
  }

  &__checkbox-mark {
    width: 9px;
    height: 5px;
    border: solid var(--momo-text-inverse);
    border-width: 0 0 2.5px 2.5px;
    transform: rotate(-45deg) scale(0) translateY(-1px);
    transition: transform 0.2s var(--momo-ease-bounce);
  }

  input:checked + &__checkbox-box {
    background: var(--momo-color-primary);
    border-color: var(--momo-color-primary-dark);
  }

  input:checked + &__checkbox-box &__checkbox-mark,
  input:indeterminate + &__checkbox-box &__checkbox-mark {
    transform: rotate(-45deg) scale(1) translateY(-1px);
  }

  input:indeterminate + &__checkbox-box {
    background: var(--momo-color-primary);
    border-color: var(--momo-color-primary-dark);
  }

  input:indeterminate + &__checkbox-box &__checkbox-mark {
    width: 9px;
    height: 0;
    border-width: 0 0 2.5px 0;
    transform: rotate(0) scale(1);
  }
}
</style>

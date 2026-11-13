<script lang="ts">
export interface DatePickerProps {
  modelValue?: string | [string, string] | null
  type?: 'date' | 'daterange'
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  minDate?: string
  maxDate?: string
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MomoIcon from '../icon/icon.vue'
import { useFloating } from '../../hooks/useFloating'
import { useClickOutside } from '../../hooks/useClickOutside'
import { formatDate, getMonthMatrix, isSameDay, parseDate } from '../../utils/date'

defineOptions({ name: 'MomoDatePicker' })

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: null,
  type: 'date',
  placeholder: '',
  disabled: false,
  clearable: true,
  minDate: '',
  maxDate: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | [string, string] | null]
  change: [value: string | [string, string] | null]
}>()

const WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六']

const visible = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const popperRef = ref<HTMLElement | null>(null)

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

const rangeStart = ref('')
const rangeEnd = ref('')
const hoverDate = ref('')

const { style: popperStyle } = useFloating(triggerRef, popperRef, visible, {
  placement: 'bottom-start',
  offset: 8,
})

useClickOutside([triggerRef, popperRef], () => {
  visible.value = false
})

const days = computed(() => getMonthMatrix(viewYear.value, viewMonth.value))

const title = computed(() => `${viewYear.value} 年 ${viewMonth.value + 1} 月`)

const hasValue = computed(() => {
  if (props.type === 'daterange') {
    return Array.isArray(props.modelValue) && props.modelValue.length === 2
  }
  return typeof props.modelValue === 'string' && !!props.modelValue
})

const displayText = computed(() => {
  if (props.type === 'daterange') {
    return Array.isArray(props.modelValue) && props.modelValue.length === 2
      ? `${props.modelValue[0]} ~ ${props.modelValue[1]}`
      : ''
  }
  return typeof props.modelValue === 'string' ? props.modelValue : ''
})

const placeholderText = computed(
  () =>
    props.placeholder ||
    (props.type === 'daterange' ? '请选择日期范围' : '请选择日期'),
)

const previewEnd = computed(() => rangeEnd.value || hoverDate.value)

function syncRangeFromModel() {
  if (Array.isArray(props.modelValue) && props.modelValue.length === 2) {
    rangeStart.value = props.modelValue[0]
    rangeEnd.value = props.modelValue[1]
  } else {
    rangeStart.value = ''
    rangeEnd.value = ''
  }
}

watch(() => props.modelValue, syncRangeFromModel, {
  immediate: true,
  deep: true,
})

function toggle() {
  if (props.disabled) return
  if (visible.value) {
    visible.value = false
    return
  }
  open()
}

function open() {
  const base =
    props.type === 'daterange'
      ? Array.isArray(props.modelValue)
        ? parseDate(props.modelValue[0])
        : null
      : typeof props.modelValue === 'string'
        ? parseDate(props.modelValue)
        : null
  const target = base ?? new Date()
  viewYear.value = target.getFullYear()
  viewMonth.value = target.getMonth()
  hoverDate.value = ''
  syncRangeFromModel()
  visible.value = true
}

function changeMonth(delta: number) {
  const date = new Date(viewYear.value, viewMonth.value + delta, 1)
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
}

function changeYear(delta: number) {
  viewYear.value += delta
}

function isToday(date: Date) {
  return isSameDay(date, new Date())
}

function isDisabledDate(date: Date) {
  const value = formatDate(date)
  if (props.minDate && value < props.minDate) return true
  if (props.maxDate && value > props.maxDate) return true
  return false
}

function inRange(date: Date) {
  if (props.type !== 'daterange' || !rangeStart.value || !previewEnd.value) {
    return false
  }
  const value = formatDate(date)
  const start = rangeStart.value
  const end = previewEnd.value
  return value >= start && value <= end
}

function isSelected(date: Date) {
  const value = formatDate(date)
  if (props.type === 'daterange') {
    return value === rangeStart.value || value === rangeEnd.value
  }
  return value === props.modelValue
}

function selectDate(date: Date) {
  if (isDisabledDate(date)) return
  const value = formatDate(date)

  if (props.type === 'date') {
    emit('update:modelValue', value)
    emit('change', value)
    visible.value = false
    return
  }

  if (!rangeStart.value || (rangeStart.value && rangeEnd.value)) {
    rangeStart.value = value
    rangeEnd.value = ''
    hoverDate.value = ''
    return
  }

  let start = rangeStart.value
  let end = value
  if (end < start) {
    ;[start, end] = [end, start]
  }
  rangeStart.value = start
  rangeEnd.value = end
  emit('update:modelValue', [start, end])
  emit('change', [start, end])
  visible.value = false
}

function selectToday() {
  const now = new Date()
  viewYear.value = now.getFullYear()
  viewMonth.value = now.getMonth()
  selectDate(now)
}

function clear(event: Event) {
  event.stopPropagation()
  const empty = props.type === 'daterange' ? null : ''
  rangeStart.value = ''
  rangeEnd.value = ''
  emit('update:modelValue', empty)
  emit('change', empty)
}
</script>

<template>
  <div
    ref="triggerRef"
    class="momo-date-picker"
    :class="{
      'is-disabled': disabled,
      'is-active': visible,
      'is-range': type === 'daterange',
    }"
    @click="toggle"
  >
    <MomoIcon name="calendar" :size="17" class="momo-date-picker__icon" />
    <span
      class="momo-date-picker__value"
      :class="{ 'is-placeholder': !displayText }"
    >
      {{ displayText || placeholderText }}
    </span>
    <button
      v-if="clearable && hasValue && !disabled"
      type="button"
      class="momo-date-picker__clear"
      @click="clear"
    >
      <MomoIcon name="close" :size="13" />
    </button>
    <MomoIcon
      v-else
      name="chevron-down"
      :size="15"
      class="momo-date-picker__suffix"
    />
  </div>

  <Teleport to="body">
    <div
      v-show="visible"
      ref="popperRef"
      class="momo-date-picker__popper"
      :class="{ 'is-range': type === 'daterange' }"
      :style="popperStyle"
      @click.stop
    >
      <div class="momo-date-picker__header">
        <button type="button" class="momo-date-picker__nav" @click="changeYear(-1)">
          «
        </button>
        <button type="button" class="momo-date-picker__nav" @click="changeMonth(-1)">
          <MomoIcon name="chevron-left" :size="16" />
        </button>
        <span class="momo-date-picker__title">{{ title }}</span>
        <button type="button" class="momo-date-picker__nav" @click="changeMonth(1)">
          <MomoIcon name="chevron-right" :size="16" />
        </button>
        <button type="button" class="momo-date-picker__nav" @click="changeYear(1)">
          »
        </button>
      </div>

      <div class="momo-date-picker__weekdays">
        <span v-for="label in WEEK_LABELS" :key="label">{{ label }}</span>
      </div>

      <div class="momo-date-picker__days">
        <button
          v-for="day in days"
          :key="day.getTime()"
          type="button"
          class="momo-date-picker__day"
          :class="{
            'is-other': day.getMonth() !== viewMonth,
            'is-today': isToday(day),
            'is-selected': isSelected(day),
            'is-in-range': inRange(day),
            'is-disabled': isDisabledDate(day),
          }"
          @click="selectDate(day)"
          @mouseenter="type === 'daterange' && !rangeEnd && (hoverDate = formatDate(day))"
        >
          {{ day.getDate() }}
        </button>
      </div>

      <div class="momo-date-picker__footer">
        <button type="button" class="momo-date-picker__today" @click="selectToday">
          今天
        </button>
        <span v-if="type === 'daterange'" class="momo-date-picker__hint">
          {{ rangeStart && !rangeEnd ? '请选择结束日期' : '请选择开始日期' }}
        </span>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
.momo-date-picker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 220px;
  padding: 0 12px;
  font-size: var(--momo-font-size-sm);
  color: var(--momo-text-regular);
  cursor: pointer;
  user-select: none;
  background: var(--momo-bg-card);
  border: var(--momo-border-width) solid var(--momo-border-color);
  border-radius: var(--momo-radius-base);
  box-shadow: var(--momo-shadow-xs);
  transition: var(--momo-transition);

  &.is-range {
    min-width: 280px;
  }

  &:hover:not(.is-disabled) {
    border-color: var(--momo-color-primary);
    box-shadow: var(--momo-shadow-sm);
  }

  &.is-active {
    border-color: var(--momo-color-primary);
    box-shadow: 0 0 0 3px var(--momo-color-primary-soft),
      var(--momo-shadow-sm);
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.55;
    background: var(--momo-bg-disabled);
  }

  &__icon {
    flex: none;
    color: var(--momo-color-primary);
  }

  &__value {
    flex: 1;
    min-width: 0;
    padding: 9px 0;
    overflow: hidden;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.is-placeholder {
      font-weight: 500;
      color: var(--momo-text-placeholder);
    }
  }

  &__clear {
    flex: none;
    display: inline-flex;
    padding: 2px;
    color: var(--momo-text-placeholder);
    cursor: pointer;
    background: var(--momo-border-soft);
    border: none;
    border-radius: 50%;
    transition: var(--momo-transition);

    &:hover {
      color: var(--momo-text-inverse);
      background: var(--momo-color-danger);
    }
  }

  &__suffix {
    flex: none;
    color: var(--momo-text-placeholder);
    transition: transform 0.2s var(--momo-ease-out);
  }

  &.is-active &__suffix {
    transform: rotate(180deg);
  }

  &__popper {
    position: fixed;
    z-index: var(--momo-z-popper);
    width: 300px;
    padding: 14px;
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-lg);
    box-shadow: var(--momo-shadow-base);
    animation: momo-pop-in 0.22s var(--momo-ease-bounce);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  &__title {
    font-size: var(--momo-font-size-sm);
    font-weight: 800;
    color: var(--momo-text-primary);
  }

  &__nav {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    font-size: 13px;
    font-weight: 800;
    color: var(--momo-text-secondary);
    cursor: pointer;
    background: var(--momo-bg-soft);
    border: 1.5px solid var(--momo-border-soft);
    border-radius: 9px;
    transition: var(--momo-transition);

    &:hover {
      color: var(--momo-text-inverse);
      background: var(--momo-color-primary);
      border-color: var(--momo-border-color);
    }
  }

  &__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 4px;

    span {
      padding: 4px 0;
      font-size: var(--momo-font-size-xs);
      font-weight: 700;
      color: var(--momo-text-placeholder);
      text-align: center;
    }
  }

  &__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  &__day {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    padding: 0;
    font-size: var(--momo-font-size-sm);
    font-weight: 600;
    color: var(--momo-text-regular);
    cursor: pointer;
    background: transparent;
    border: 1.5px solid transparent;
    border-radius: 10px;
    transition: var(--momo-transition);

    &:hover:not(.is-disabled) {
      color: var(--momo-color-primary);
      background: var(--momo-color-primary-soft);
    }

    &.is-other {
      color: var(--momo-text-placeholder);
      opacity: 0.55;
    }

    &.is-today {
      border-color: var(--momo-color-primary);
    }

    &.is-in-range {
      color: var(--momo-color-primary);
      background: var(--momo-color-primary-soft);
      border-radius: 0;
    }

    &.is-selected {
      color: var(--momo-text-inverse);
      background: var(--momo-color-primary);
      border-color: var(--momo-border-color);
      border-radius: 10px;
      box-shadow: 2px 2px 0 var(--momo-border-color);
    }

    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.35;
      text-decoration: line-through;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1.5px dashed var(--momo-border-soft);
  }

  &__today {
    font-size: var(--momo-font-size-xs);
    font-weight: 800;
    color: var(--momo-color-primary);
    cursor: pointer;
    background: transparent;
    border: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__hint {
    font-size: var(--momo-font-size-xs);
    color: var(--momo-text-placeholder);
  }
}
</style>

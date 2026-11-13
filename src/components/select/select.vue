<script lang="ts">
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps {
  modelValue?: any
  options?: SelectOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  multiple?: boolean
  filterable?: boolean
  size?: 'small' | 'default' | 'large'
  status?: '' | 'error' | 'warning'
  emptyText?: string
}
</script>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useFloating } from '../../hooks/useFloating'
import { useClickOutside } from '../../hooks/useClickOutside'
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoSelect' })

const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
  placeholder: '请选择',
  disabled: false,
  clearable: false,
  multiple: false,
  filterable: false,
  size: 'default',
  status: '',
  emptyText: '没有选项',
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any]
  visibleChange: [visible: boolean]
  clear: []
}>()

const visible = ref(false)
const hovering = ref(false)
const query = ref('')
const triggerRef = ref<HTMLElement | null>(null)
const popperRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)

const { style: popperStyle } = useFloating(triggerRef, popperRef, visible, {
  placement: 'bottom-start',
})

useClickOutside([triggerRef, popperRef], () => close())

watch(visible, (v) => emit('visibleChange', v))

const selectedOptions = computed<SelectOption[]>(() => {
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? props.modelValue : []
    return values
      .map((v: any) => props.options.find((opt) => opt.value === v))
      .filter(Boolean) as SelectOption[]
  }
  const found = props.options.find((opt) => opt.value === props.modelValue)
  return found ? [found] : []
})

const hasValue = computed(() =>
  props.multiple
    ? Array.isArray(props.modelValue) && props.modelValue.length > 0
    : props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== '',
)

const showClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    hasValue.value &&
    (hovering.value || visible.value),
)

const filteredOptions = computed(() => {
  if (!props.filterable || !query.value.trim()) return props.options
  const q = query.value.trim().toLowerCase()
  return props.options.filter((opt) => opt.label.toLowerCase().includes(q))
})

function isSelected(option: SelectOption) {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(option.value)
  }
  return props.modelValue === option.value
}

function close() {
  visible.value = false
  query.value = ''
}

function open() {
  if (props.disabled) return
  visible.value = true
  query.value = ''
  nextTick(() => searchRef.value?.focus())
}

function toggle() {
  if (props.disabled) return
  if (visible.value) close()
  else open()
}

function choose(option: SelectOption) {
  if (option.disabled) return
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = current.indexOf(option.value)
    if (index > -1) current.splice(index, 1)
    else current.push(option.value)
    emit('update:modelValue', current)
    emit('change', current)
  } else {
    emit('update:modelValue', option.value)
    emit('change', option.value)
    close()
  }
}

function removeValue(option: SelectOption, event: MouseEvent) {
  event.stopPropagation()
  if (props.disabled) return
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const index = current.indexOf(option.value)
  if (index > -1) current.splice(index, 1)
  emit('update:modelValue', current)
  emit('change', current)
}

function clear() {
  const next = props.multiple ? [] : undefined
  emit('update:modelValue', next)
  emit('change', next)
  emit('clear')
}
</script>

<template>
  <div
    ref="triggerRef"
    class="momo-select"
    :class="[
      `momo-select--${size}`,
      {
        'is-open': visible,
        'is-disabled': disabled,
        'is-error': status === 'error',
        'is-warning': status === 'warning',
      },
    ]"
    tabindex="0"
    @click="toggle"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @keydown.esc="close"
  >
    <div class="momo-select__value">
      <template v-if="multiple && selectedOptions.length">
        <span
          v-for="opt in selectedOptions"
          :key="String(opt.value)"
          class="momo-select__tag"
        >
          {{ opt.label }}
          <MomoIcon
            name="close"
            :size="12"
            class="momo-select__tag-close"
            @click="removeValue(opt, $event)"
          />
        </span>
      </template>
      <span v-else-if="!multiple && selectedOptions.length">
        {{ selectedOptions[0].label }}
      </span>
      <span v-else class="momo-select__placeholder">{{ placeholder }}</span>
    </div>

    <span class="momo-select__suffix">
      <MomoIcon
        v-if="showClear"
        name="close"
        :size="15"
        class="momo-select__clear"
        @click.stop="clear"
      />
      <MomoIcon
        name="chevron-down"
        :size="16"
        class="momo-select__arrow"
        :class="{ 'is-open': visible }"
      />
    </span>
  </div>

  <Teleport to="body">
    <div
      v-show="visible"
      ref="popperRef"
      class="momo-select__popper"
      :style="popperStyle"
    >
      <div v-if="filterable" class="momo-select__search">
        <MomoIcon name="search" :size="14" />
        <input
          ref="searchRef"
          v-model="query"
          class="momo-select__search-input"
          placeholder="搜索选项…"
          @click.stop
          @keydown.esc.stop="close"
        />
      </div>

      <div class="momo-select__list momo-scrollbar">
        <div
          v-for="opt in filteredOptions"
          :key="String(opt.value)"
          class="momo-select__option"
          :class="{
            'is-selected': isSelected(opt),
            'is-disabled': opt.disabled,
          }"
          @click="choose(opt)"
        >
          <span>{{ opt.label }}</span>
          <MomoIcon v-if="isSelected(opt)" name="check" :size="15" />
        </div>
        <div v-if="!filteredOptions.length" class="momo-select__empty">
          {{ emptyText }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
.momo-select {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: var(--momo-height-base);
  padding: 0 12px;
  background: var(--momo-bg-card);
  border: var(--momo-border-width) solid var(--momo-border-color);
  border-radius: var(--momo-radius-base);
  box-shadow: var(--momo-shadow-xs);
  cursor: pointer;
  outline: none;
  transition: var(--momo-transition);

  &:focus-visible,
  &.is-open {
    border-color: var(--momo-color-primary);
    box-shadow: 0 0 0 4px var(--momo-color-primary-soft);
  }

  &.is-error {
    border-color: var(--momo-color-danger);
  }

  &.is-warning {
    border-color: var(--momo-color-warning);
  }

  &.is-disabled {
    background: var(--momo-bg-disabled);
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.8;
  }

  &__value {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    min-width: 0;
    font-size: var(--momo-font-size-base);
  }

  &__placeholder {
    color: var(--momo-text-placeholder);
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 1px 8px;
    font-size: var(--momo-font-size-xs);
    font-weight: 700;
    color: var(--momo-color-primary-dark);
    background: var(--momo-color-primary-soft);
    border: 1.5px solid var(--momo-color-primary-light);
    border-radius: var(--momo-radius-round);
  }

  &__tag-close {
    cursor: pointer;

    &:hover {
      color: var(--momo-color-danger);
    }
  }

  &__suffix {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    color: var(--momo-text-secondary);
  }

  &__clear {
    cursor: pointer;

    &:hover {
      color: var(--momo-color-danger);
      transform: scale(1.12);
    }
  }

  &__arrow {
    transition: transform 0.24s var(--momo-ease-bounce);

    &.is-open {
      transform: rotate(180deg);
    }
  }

  &__popper {
    position: fixed;
    z-index: var(--momo-z-popper);
    min-width: 180px;
    padding: 6px;
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-base);
    box-shadow: var(--momo-shadow-base);
    animation: momo-pop-in 0.2s var(--momo-ease-bounce);
  }

  &__search {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    margin-bottom: 4px;
    color: var(--momo-text-secondary);
    background: var(--momo-bg-soft);
    border-radius: var(--momo-radius-sm);
  }

  &__search-input {
    flex: 1;
    min-width: 0;
    font: inherit;
    color: var(--momo-text-primary);
    background: transparent;
    border: none;
    outline: none;
  }

  &__list {
    max-height: 240px;
    overflow-y: auto;
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    font-size: var(--momo-font-size-sm);
    border-radius: var(--momo-radius-sm);
    cursor: pointer;
    transition: var(--momo-transition-fast);

    &:hover {
      background: var(--momo-bg-hover);
    }

    &.is-selected {
      font-weight: 700;
      color: var(--momo-color-primary-dark);
      background: var(--momo-color-primary-soft);
    }

    &.is-disabled {
      color: var(--momo-text-placeholder);
      cursor: not-allowed;
      background: transparent;
    }
  }

  &__empty {
    padding: 18px 0;
    font-size: var(--momo-font-size-sm);
    color: var(--momo-text-placeholder);
    text-align: center;
  }

  &--small {
    min-height: var(--momo-height-sm);
    font-size: var(--momo-font-size-sm);
    border-radius: var(--momo-radius-sm);
  }

  &--large {
    min-height: var(--momo-height-lg);
    border-radius: var(--momo-radius-lg);
  }
}
</style>

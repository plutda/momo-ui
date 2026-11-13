<script lang="ts">
export interface InputNumberProps {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  precision?: number
  disabled?: boolean
  size?: 'small' | 'default' | 'large'
  placeholder?: string
  controls?: boolean
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoInputNumber' })

const props = withDefaults(defineProps<InputNumberProps>(), {
  modelValue: undefined,
  min: -Infinity,
  max: Infinity,
  step: 1,
  disabled: false,
  size: 'default',
  controls: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
  change: [value: number | undefined]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const displayValue = computed(() => {
  const v = props.modelValue
  if (v === undefined || v === null || Number.isNaN(v)) return ''
  return props.precision !== undefined ? Number(v).toFixed(props.precision) : String(v)
})

const canDecrease = computed(() => (props.modelValue ?? 0) > props.min)
const canIncrease = computed(() => (props.modelValue ?? 0) < props.max)

function normalize(value: number): number {
  let next = Math.min(Math.max(value, props.min), props.max)
  if (props.precision !== undefined) {
    next = Number(next.toFixed(props.precision))
  }
  return next
}

function commit(value: number | undefined) {
  emit('update:modelValue', value)
  emit('change', value)
}

function stepBy(direction: 1 | -1) {
  if (props.disabled) return
  const base = props.modelValue ?? 0
  commit(normalize(base + direction * props.step))
}

function handleInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  if (raw === '' || raw === '-') {
    commit(undefined)
    return
  }
  const num = Number(raw)
  if (!Number.isNaN(num)) commit(normalize(num))
}

function handleBlur(event: FocusEvent) {
  if (props.modelValue === undefined) {
    commit(normalize(props.min === -Infinity ? 0 : props.min))
  }
  emit('blur', event)
}
</script>

<template>
  <div
    class="momo-input-number"
    :class="[`momo-input-number--${size}`, { 'is-disabled': disabled }]"
  >
    <button
      v-if="controls"
      type="button"
      class="momo-input-number__btn is-decrease"
      :disabled="disabled || !canDecrease"
      @click="stepBy(-1)"
    >
      <MomoIcon name="minus" :size="14" />
    </button>
    <input
      class="momo-input-number__input"
      type="text"
      inputmode="decimal"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="handleInput"
      @focus="emit('focus', $event)"
      @blur="handleBlur"
    />
    <button
      v-if="controls"
      type="button"
      class="momo-input-number__btn is-increase"
      :disabled="disabled || !canIncrease"
      @click="stepBy(1)"
    >
      <MomoIcon name="plus" :size="14" />
    </button>
  </div>
</template>

<style lang="scss">
.momo-input-number {
  display: inline-flex;
  align-items: stretch;
  width: 100%;
  min-height: var(--momo-height-base);
  overflow: hidden;
  background: var(--momo-bg-card);
  border: var(--momo-border-width) solid var(--momo-border-color);
  border-radius: var(--momo-radius-base);
  box-shadow: var(--momo-shadow-xs);
  transition: var(--momo-transition);

  &:focus-within {
    border-color: var(--momo-color-primary);
    box-shadow: 0 0 0 4px var(--momo-color-primary-soft);
  }

  &.is-disabled {
    background: var(--momo-bg-disabled);
    box-shadow: none;
  }

  &__input {
    flex: 1;
    width: 100%;
    min-width: 0;
    padding: 0 8px;
    font: inherit;
    font-variant-numeric: tabular-nums;
    color: inherit;
    text-align: center;
    background: transparent;
    border: none;
    outline: none;

    &::placeholder {
      color: var(--momo-text-placeholder);
    }
  }

  &__btn {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 34px;
    color: var(--momo-text-primary);
    cursor: pointer;
    background: var(--momo-bg-soft);
    border: none;
    outline: none;
    transition: var(--momo-transition-fast);

    &:hover:not(:disabled) {
      color: var(--momo-text-inverse);
      background: var(--momo-color-primary);
    }

    &:active:not(:disabled) {
      background: var(--momo-color-primary-dark);
    }

    &:disabled {
      color: var(--momo-text-placeholder);
      cursor: not-allowed;
      background: var(--momo-bg-disabled);
    }

    &.is-decrease {
      border-right: var(--momo-border-width) solid var(--momo-border-color);
    }

    &.is-increase {
      border-left: var(--momo-border-width) solid var(--momo-border-color);
    }
  }

  &--small {
    min-height: var(--momo-height-sm);
    font-size: var(--momo-font-size-sm);
    border-radius: var(--momo-radius-sm);

    .momo-input-number__btn {
      width: 28px;
    }
  }

  &--large {
    min-height: var(--momo-height-lg);
    font-size: var(--momo-font-size-lg);
    border-radius: var(--momo-radius-lg);

    .momo-input-number__btn {
      width: 42px;
    }
  }
}
</style>

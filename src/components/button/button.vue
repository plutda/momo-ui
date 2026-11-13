<script lang="ts">
export type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ButtonSize = 'small' | 'default' | 'large'

export interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  plain?: boolean
  round?: boolean
  circle?: boolean
  block?: boolean
  disabled?: boolean
  loading?: boolean
  icon?: string
  nativeType?: 'button' | 'submit' | 'reset'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoButton' })

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'default',
  nativeType: 'button',
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const classes = computed(() => [
  `momo-button--${props.type}`,
  `momo-button--${props.size}`,
  {
    'is-plain': props.plain,
    'is-round': props.round,
    'is-circle': props.circle,
    'is-block': props.block,
    'is-disabled': props.disabled,
    'is-loading': props.loading,
  },
])

function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) return
  emit('click', event)
}
</script>

<template>
  <button
    class="momo-button"
    :class="classes"
    :type="nativeType"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <MomoIcon v-if="loading" name="loading" spin :size="16" class="momo-button__icon" />
    <MomoIcon v-else-if="icon" :name="icon" :size="16" class="momo-button__icon" />
    <span v-if="!circle" class="momo-button__label">
      <slot />
    </span>
    <slot v-else />
  </button>
</template>

<style lang="scss">
.momo-button {
  --momo-btn-bg: var(--momo-bg-card);
  --momo-btn-color: var(--momo-text-primary);
  --momo-btn-border: var(--momo-border-color);

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: var(--momo-height-base);
  padding: 0 18px;
  font-family: inherit;
  font-size: var(--momo-font-size-base);
  font-weight: 700;
  line-height: 1;
  color: var(--momo-btn-color);
  background: var(--momo-btn-bg);
  border: var(--momo-border-width) solid var(--momo-btn-border);
  border-radius: var(--momo-radius-base);
  box-shadow: var(--momo-shadow-base);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  outline: none;
  transition: var(--momo-transition);

  &:hover:not(:disabled) {
    transform: translate(-1px, -1px);
    box-shadow: var(--momo-shadow-lg);
    filter: brightness(1.04);
  }

  &:active:not(:disabled) {
    transform: translate(3px, 3px);
    box-shadow: 0 0 0 rgba(45, 42, 62, 0);
    transition-duration: 0.08s;
  }

  &:focus-visible {
    outline: 3px solid var(--momo-color-primary-soft);
    outline-offset: 3px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    box-shadow: var(--momo-shadow-xs);
    transform: none;
  }

  &__icon {
    flex: none;
  }

  &__label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  &--primary {
    --momo-btn-bg: var(--momo-color-primary);
    --momo-btn-color: var(--momo-text-inverse);
  }

  &--success {
    --momo-btn-bg: var(--momo-color-success);
    --momo-btn-color: var(--momo-text-inverse);
  }

  &--warning {
    --momo-btn-bg: var(--momo-color-warning);
    --momo-btn-color: var(--momo-text-inverse);
  }

  &--danger {
    --momo-btn-bg: var(--momo-color-danger);
    --momo-btn-color: var(--momo-text-inverse);
  }

  &--info {
    --momo-btn-bg: var(--momo-color-info);
    --momo-btn-color: var(--momo-text-inverse);
  }

  &.is-plain {
    --momo-btn-bg: var(--momo-bg-card);
  }

  &.is-plain.momo-button--primary {
    --momo-btn-color: var(--momo-color-primary);
    --momo-btn-bg: var(--momo-color-primary-soft);
  }

  &.is-plain.momo-button--success {
    --momo-btn-color: var(--momo-color-success);
    --momo-btn-bg: var(--momo-color-success-soft);
  }

  &.is-plain.momo-button--warning {
    --momo-btn-color: var(--momo-color-warning);
    --momo-btn-bg: var(--momo-color-warning-soft);
  }

  &.is-plain.momo-button--danger {
    --momo-btn-color: var(--momo-color-danger);
    --momo-btn-bg: var(--momo-color-danger-soft);
  }

  &.is-plain.momo-button--info {
    --momo-btn-color: var(--momo-color-info);
    --momo-btn-bg: var(--momo-color-info-soft);
  }

  &--small {
    height: var(--momo-height-sm);
    padding: 0 12px;
    font-size: var(--momo-font-size-sm);
    border-radius: var(--momo-radius-sm);
    box-shadow: var(--momo-shadow-xs);
  }

  &--large {
    height: var(--momo-height-lg);
    padding: 0 26px;
    font-size: var(--momo-font-size-lg);
    border-radius: var(--momo-radius-lg);
    box-shadow: var(--momo-shadow-lg);
  }

  &.is-round {
    border-radius: var(--momo-radius-round);
  }

  &.is-circle {
    width: var(--momo-height-base);
    padding: 0;
    border-radius: 50%;

    &.momo-button--small {
      width: var(--momo-height-sm);
    }

    &.momo-button--large {
      width: var(--momo-height-lg);
    }
  }

  &.is-block {
    display: flex;
    width: 100%;
  }
}
</style>

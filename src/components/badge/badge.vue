<script lang="ts">
export interface BadgeProps {
  value?: string | number
  max?: number
  dot?: boolean
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  color?: string
  hidden?: boolean
  showZero?: boolean
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'MomoBadge' })

const props = withDefaults(defineProps<BadgeProps>(), {
  value: '',
  max: 99,
  dot: false,
  type: 'danger',
  hidden: false,
  showZero: false,
})

const content = computed(() => {
  if (props.dot) return ''
  const value = props.value
  if (typeof value === 'number') {
    return value > props.max ? `${props.max}+` : String(value)
  }
  return String(value)
})

const isHidden = computed(() => {
  if (props.hidden) return true
  if (props.dot) return false
  if (props.value === '' || props.value === undefined || props.value === null) {
    return true
  }
  return Number(props.value) === 0 && !props.showZero
})
</script>

<template>
  <span class="momo-badge">
    <slot />
    <sup
      v-if="!isHidden"
      class="momo-badge__content"
      :class="[
        `momo-badge__content--${type}`,
        { 'is-dot': dot, 'is-fixed': $slots.default },
      ]"
      :style="color ? { background: color, borderColor: color } : undefined"
    >
      {{ dot ? '' : content }}
    </sup>
  </span>
</template>

<style lang="scss">
.momo-badge {
  --momo-badge-bg: var(--momo-color-danger);

  position: relative;
  display: inline-flex;
  vertical-align: middle;

  &__content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
    color: var(--momo-text-inverse);
    background: var(--momo-badge-bg);
    border: 1.5px solid var(--momo-bg-card);
    border-radius: var(--momo-radius-round);
    box-shadow: var(--momo-shadow-xs);

    &.is-fixed {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
      transform-origin: 100% 0;
    }

    &.is-dot {
      min-width: 10px;
      width: 10px;
      height: 10px;
      padding: 0;
    }

    &--primary {
      --momo-badge-bg: var(--momo-color-primary);
    }

    &--success {
      --momo-badge-bg: var(--momo-color-success);
    }

    &--warning {
      --momo-badge-bg: var(--momo-color-warning);
    }

    &--info {
      --momo-badge-bg: var(--momo-color-info);
    }
  }
}
</style>

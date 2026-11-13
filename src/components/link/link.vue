<script lang="ts">
export interface LinkProps {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  underline?: 'never' | 'hover' | 'always'
  disabled?: boolean
  href?: string
  target?: string
  icon?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoLink' })

const props = withDefaults(defineProps<LinkProps>(), {
  type: 'primary',
  underline: 'hover',
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const classes = computed(() => [
  `momo-link--${props.type}`,
  `momo-link--underline-${props.underline}`,
  { 'is-disabled': props.disabled },
])

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}
</script>

<template>
  <component
    :is="href && !disabled ? 'a' : 'span'"
    class="momo-link"
    :class="classes"
    :href="disabled ? undefined : href"
    :target="target"
    @click="handleClick"
  >
    <MomoIcon v-if="icon" :name="icon" :size="14" />
    <slot />
  </component>
</template>

<style lang="scss">
.momo-link {
  --momo-link-color: var(--momo-color-primary);

  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  color: var(--momo-link-color);
  text-decoration: none;
  cursor: pointer;
  transition: var(--momo-transition-fast);

  &:hover {
    color: var(--momo-color-primary-dark);
    transform: translateY(-1px);
  }

  &--default {
    --momo-link-color: var(--momo-text-primary);
  }

  &--success {
    --momo-link-color: var(--momo-color-success);
  }

  &--warning {
    --momo-link-color: var(--momo-color-warning);
  }

  &--danger {
    --momo-link-color: var(--momo-color-danger);
  }

  &--info {
    --momo-link-color: var(--momo-color-info);
  }

  &--underline-always {
    text-decoration: underline wavy;
    text-underline-offset: 4px;
  }

  &--underline-hover {
    &:hover {
      text-decoration: underline wavy;
      text-underline-offset: 4px;
    }
  }

  &.is-disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }
}
</style>

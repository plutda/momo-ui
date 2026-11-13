<script lang="ts">
export interface IconProps {
  name: string
  size?: number | string
  color?: string
  spin?: boolean
  strokeWidth?: number
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { icons } from './icons'

defineOptions({ name: 'MomoIcon' })

const props = withDefaults(defineProps<IconProps>(), {
  size: 18,
  spin: false,
  strokeWidth: 2,
})

const paths = computed(() => icons[props.name] ?? [])

const iconStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size
  return { width: size, height: size, color: props.color }
})
</script>

<template>
  <svg
    class="momo-icon"
    :class="{ 'is-spin': spin }"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(d, index) in paths" :key="index" :d="d" />
    <slot />
  </svg>
</template>

<style lang="scss">
.momo-icon {
  display: inline-block;
  flex: none;
  vertical-align: middle;

  &.is-spin {
    animation: momo-spin 0.9s linear infinite;
    transform-origin: center;
  }
}
</style>

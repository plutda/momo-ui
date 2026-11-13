<script lang="ts">
export type SpaceSize = 'small' | 'default' | 'large' | number | string

export interface SpaceProps {
  size?: SpaceSize
  direction?: 'horizontal' | 'vertical'
  wrap?: boolean
  align?: 'start' | 'center' | 'end' | 'baseline'
  fill?: boolean
}
</script>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

defineOptions({ name: 'MomoSpace' })

const props = withDefaults(defineProps<SpaceProps>(), {
  size: 'default',
  direction: 'horizontal',
  wrap: false,
  align: 'center',
})

const sizeMap: Record<string, string> = {
  small: '8px',
  default: '12px',
  large: '20px',
}

const gap = computed(() => {
  if (typeof props.size === 'number') return `${props.size}px`
  return sizeMap[props.size] ?? props.size
})

const spaceStyle = computed<CSSProperties>(() => ({
  gap: gap.value,
  flexDirection: props.direction === 'vertical' ? 'column' : 'row',
  flexWrap: props.wrap ? 'wrap' : 'nowrap',
  alignItems:
    props.align === 'start'
      ? 'flex-start'
      : props.align === 'end'
        ? 'flex-end'
        : props.align,
  width: props.fill ? '100%' : undefined,
}))
</script>

<template>
  <div class="momo-space" :style="spaceStyle">
    <slot />
  </div>
</template>

<style lang="scss">
.momo-space {
  display: inline-flex;

  & > * {
    flex: none;
  }
}
</style>

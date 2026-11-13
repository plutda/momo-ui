<script lang="ts">
export interface RowProps {
  gutter?: number | string
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
  align?: 'start' | 'center' | 'end'
  wrap?: boolean
}
</script>

<script setup lang="ts">
import { computed, provide, type CSSProperties } from 'vue'

defineOptions({ name: 'MomoRow' })

const props = withDefaults(defineProps<RowProps>(), {
  gutter: 0,
  wrap: true,
  justify: 'start',
  align: 'start',
})

const gutterValue = computed(() =>
  typeof props.gutter === 'number' ? props.gutter : parseFloat(props.gutter) || 0,
)

provide('momoRowGutter', gutterValue)

const rowStyle = computed<CSSProperties>(() => {
  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    'space-between': 'space-between',
    'space-around': 'space-around',
  } as const
  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  } as const
  return {
    marginLeft: `${-gutterValue.value / 2}px`,
    marginRight: `${-gutterValue.value / 2}px`,
    justifyContent: justifyMap[props.justify],
    alignItems: alignMap[props.align],
    flexWrap: props.wrap ? 'wrap' : 'nowrap',
  }
})
</script>

<template>
  <div class="momo-row" :style="rowStyle">
    <slot />
  </div>
</template>

<style lang="scss">
.momo-row {
  display: flex;
  width: 100%;
}
</style>

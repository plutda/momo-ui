<script lang="ts">
export interface StatisticProps {
  title?: string
  value?: number | string
  precision?: number
  prefix?: string
  suffix?: string
  separator?: boolean
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'MomoStatistic' })

const props = withDefaults(defineProps<StatisticProps>(), {
  value: 0,
  separator: true,
})

const displayValue = computed(() => {
  const raw = props.value
  if (typeof raw === 'number' && !Number.isNaN(raw)) {
    let text =
      props.precision !== undefined
        ? raw.toFixed(props.precision)
        : String(raw)
    if (props.separator) {
      const [int, decimal] = text.split('.')
      text =
        int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
        (decimal !== undefined ? `.${decimal}` : '')
    }
    return text
  }
  return String(raw ?? '')
})
</script>

<template>
  <div class="momo-statistic">
    <div v-if="title || $slots.title" class="momo-statistic__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="momo-statistic__value">
      <span v-if="prefix" class="momo-statistic__prefix">{{ prefix }}</span>
      <span class="momo-statistic__number">{{ displayValue }}</span>
      <span v-if="suffix" class="momo-statistic__suffix">{{ suffix }}</span>
    </div>
  </div>
</template>

<style lang="scss">
.momo-statistic {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;

  &__title {
    font-size: var(--momo-font-size-sm);
    font-weight: 700;
    color: var(--momo-text-secondary);
  }

  &__value {
    display: flex;
    align-items: baseline;
    gap: 4px;
    color: var(--momo-text-primary);
  }

  &__number {
    font-size: var(--momo-font-size-xxl);
    font-weight: 800;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.5px;
    animation: momo-pop-in 0.3s var(--momo-ease-bounce);
  }

  &__prefix,
  &__suffix {
    font-size: var(--momo-font-size-base);
    font-weight: 700;
    color: var(--momo-text-secondary);
  }
}
</style>

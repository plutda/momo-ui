<script lang="ts">
export interface ProgressProps {
  percentage?: number
  type?: 'line' | 'circle'
  status?: 'success' | 'warning' | 'error' | ''
  strokeWidth?: number
  color?: string
  trackColor?: string
  showText?: boolean
  textInside?: boolean
  striped?: boolean
  stripedFlow?: boolean
  width?: number
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import MomoIcon from '../icon/icon.vue'
import { addUnit } from '../../utils/dom'

defineOptions({ name: 'MomoProgress' })

const props = withDefaults(defineProps<ProgressProps>(), {
  percentage: 0,
  type: 'line',
  status: '',
  strokeWidth: 12,
  color: '',
  trackColor: 'var(--momo-bg-soft)',
  showText: true,
  textInside: false,
  striped: false,
  stripedFlow: false,
  width: 120,
})

const percent = computed(() =>
  Math.min(100, Math.max(0, Number(props.percentage) || 0)),
)

const size = computed(() => Math.max(24, Number(props.width) || 120))

const radius = computed(() => (size.value - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(
  () => circumference.value * (1 - percent.value / 100),
)

const color = computed(() => {
  if (props.color) return props.color
  if (props.status === 'success') return 'var(--momo-color-success)'
  if (props.status === 'warning') return 'var(--momo-color-warning)'
  if (props.status === 'error') return 'var(--momo-color-danger)'
  return 'var(--momo-color-primary)'
})

const statusIcon = computed(() => {
  if (props.status === 'success') return 'check'
  if (props.status === 'warning') return 'warning'
  if (props.status === 'error') return 'close'
  return ''
})

const displayText = computed(() => `${Math.round(percent.value)}%`)

const circleIconSize = computed(() => Math.max(16, Math.round(size.value / 4.5)))

const barStyle = computed(() => ({
  height: addUnit(props.strokeWidth),
  background: props.trackColor,
  borderRadius: addUnit(props.strokeWidth),
}))

const innerStyle = computed(() => ({
  width: `${percent.value}%`,
  background: color.value,
  borderRadius: addUnit(props.strokeWidth),
}))
</script>

<template>
  <div
    class="momo-progress"
    :class="[`momo-progress--${type}`, `is-${status || 'default'}`]"
  >
    <template v-if="type === 'line'">
      <div class="momo-progress__bar" :style="barStyle">
        <div
          class="momo-progress__inner"
          :class="{ 'is-striped': striped, 'is-flow': stripedFlow }"
          :style="innerStyle"
        >
          <span v-if="textInside && showText" class="momo-progress__text">
            {{ displayText }}
          </span>
        </div>
      </div>
      <span v-if="showText && !textInside" class="momo-progress__outside">
        <MomoIcon
          v-if="statusIcon"
          :name="statusIcon"
          :size="18"
          :style="{ color }"
        />
        <template v-else>{{ displayText }}</template>
      </span>
    </template>

    <template v-else>
      <div
        class="momo-progress__circle"
        :style="{ width: addUnit(size), height: addUnit(size) }"
      >
        <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
          <circle
            :cx="size / 2"
            :cy="size / 2"
            :r="radius"
            fill="none"
            :stroke="trackColor"
            :stroke-width="strokeWidth"
          />
          <circle
            class="momo-progress__circle-path"
            :cx="size / 2"
            :cy="size / 2"
            :r="radius"
            fill="none"
            :stroke="color"
            :stroke-width="strokeWidth"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            :transform="`rotate(-90 ${size / 2} ${size / 2})`"
          />
        </svg>
        <div v-if="showText" class="momo-progress__circle-text">
          <MomoIcon
            v-if="statusIcon"
            :name="statusIcon"
            :size="circleIconSize"
            :style="{ color }"
          />
          <span v-else>{{ displayText }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.momo-progress {
  &--line {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  &--circle {
    display: inline-flex;
  }

  &__bar {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    border: 1.5px solid var(--momo-border-soft);
  }

  &__inner {
    position: relative;
    height: 100%;
    min-width: 0;
    transition: width 0.4s var(--momo-ease-out);

    &.is-striped {
      background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.28) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.28) 50%,
        rgba(255, 255, 255, 0.28) 75%,
        transparent 75%,
        transparent
      );
      background-size: 18px 18px;
    }

    &.is-flow {
      animation: momo-progress-striped 0.8s linear infinite;
    }
  }

  &__text {
    position: absolute;
    top: 50%;
    right: 8px;
    font-size: var(--momo-font-size-xs);
    font-weight: 800;
    color: #fff;
    transform: translateY(-50%);
  }

  &__outside {
    flex: none;
    display: inline-flex;
    align-items: center;
    min-width: 38px;
    font-size: var(--momo-font-size-sm);
    font-weight: 800;
    color: var(--momo-text-secondary);
  }

  &__circle {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__circle-path {
    transition: stroke-dashoffset 0.4s var(--momo-ease-out);
  }

  &__circle-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--momo-font-size-base);
    font-weight: 800;
    color: var(--momo-text-primary);
  }
}

@keyframes momo-progress-striped {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 18px 0;
  }
}
</style>

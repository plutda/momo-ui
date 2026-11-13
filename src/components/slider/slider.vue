<script lang="ts">
export interface SliderProps {
  modelValue?: number | [number, number]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  range?: boolean
  showTooltip?: boolean
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

defineOptions({ name: 'MomoSlider' })

const props = withDefaults(defineProps<SliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  range: false,
  showTooltip: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | [number, number]]
  change: [value: number | [number, number]]
}>()

const trackRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const values = computed<number[]>(() =>
  Array.isArray(props.modelValue)
    ? [...props.modelValue]
    : [typeof props.modelValue === 'number' ? props.modelValue : props.min],
)

const startValue = computed(() => values.value[0])
const endValue = computed(() => values.value[1] ?? values.value[0])

function percentOf(value: number): number {
  const span = props.max - props.min || 1
  return ((value - props.min) / span) * 100
}

const barStyle = computed(() => {
  if (!props.range) {
    return { left: '0%', width: `${percentOf(startValue.value)}%` }
  }
  const start = Math.min(percentOf(startValue.value), percentOf(endValue.value))
  const end = Math.max(percentOf(startValue.value), percentOf(endValue.value))
  return { left: `${start}%`, width: `${end - start}%` }
})

function clamp(value: number): number {
  const stepped = Math.round((value - props.min) / props.step) * props.step + props.min
  return Math.min(Math.max(Number(stepped.toFixed(10)), props.min), props.max)
}

function valueFromEvent(event: PointerEvent): number {
  const el = trackRef.value
  if (!el) return props.min
  const rect = el.getBoundingClientRect()
  const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
  return clamp(props.min + ratio * (props.max - props.min))
}

function commit(value: number | [number, number]) {
  emit('update:modelValue', value)
  emit('change', value)
}

function handleMove(event: PointerEvent) {
  const next = valueFromEvent(event)
  if (props.range) {
    const pair: [number, number] = [startValue.value, endValue.value]
    if (activeIndex.value === 0) pair[0] = Math.min(next, endValue.value)
    else pair[1] = Math.max(next, startValue.value)
    commit(pair)
  } else {
    commit(next)
  }
}

function stopDrag() {
  window.removeEventListener('pointermove', handleMove)
  window.removeEventListener('pointerup', stopDrag)
}

function handlePointerDown(event: PointerEvent) {
  if (props.disabled) return
  const value = valueFromEvent(event)
  if (props.range) {
    activeIndex.value =
      Math.abs(value - startValue.value) <= Math.abs(value - endValue.value) ? 0 : 1
  } else {
    activeIndex.value = 0
  }
  handleMove(event)
  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', stopDrag)
}

onBeforeUnmount(stopDrag)
</script>

<template>
  <div class="momo-slider" :class="{ 'is-disabled': disabled }">
    <div
      ref="trackRef"
      class="momo-slider__track"
      @pointerdown="handlePointerDown"
    >
      <div class="momo-slider__bar" :style="barStyle" />
      <div
        v-for="(value, index) in values"
        :key="index"
        class="momo-slider__handle"
        :style="{ left: `${percentOf(value)}%` }"
      >
        <span v-if="showTooltip" class="momo-slider__tooltip">{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.momo-slider {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 24px 10px 12px;

  &__track {
    position: relative;
    width: 100%;
    height: 10px;
    background: var(--momo-bg-soft);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-round);
    cursor: pointer;
    touch-action: none;
  }

  &__bar {
    position: absolute;
    top: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      var(--momo-color-primary-light),
      var(--momo-color-primary)
    );
    border-radius: var(--momo-radius-round);
    transition: width 0.08s linear;
  }

  &__handle {
    position: absolute;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: 50%;
    box-shadow: var(--momo-shadow-xs);
    transform: translate(-50%, -50%);
    transition: transform 0.18s var(--momo-ease-bounce);

    &:hover {
      transform: translate(-50%, -50%) scale(1.15);
    }

    &:active {
      transform: translate(-50%, -50%) scale(0.95);
    }
  }

  &__tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    padding: 2px 8px;
    font-size: var(--momo-font-size-xs);
    font-weight: 700;
    color: var(--momo-text-inverse);
    white-space: nowrap;
    background: var(--momo-text-primary);
    border-radius: var(--momo-radius-round);
    transform: translateX(-50%);

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      border: 4px solid transparent;
      border-top-color: var(--momo-text-primary);
      transform: translateX(-50%);
    }
  }

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>

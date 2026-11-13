<script lang="ts">
export interface CarouselProps {
  height?: number | string
  autoplay?: boolean
  interval?: number
  indicator?: boolean
  arrow?: 'always' | 'hover' | 'never'
  initialIndex?: number
}
</script>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import MomoIcon from '../icon/icon.vue'
import { carouselContextKey } from './context'
import { addUnit } from '../../utils/dom'

defineOptions({ name: 'MomoCarousel' })

const props = withDefaults(defineProps<CarouselProps>(), {
  height: 320,
  autoplay: true,
  interval: 4000,
  indicator: true,
  arrow: 'hover',
  initialIndex: 0,
})

const emit = defineEmits<{ change: [index: number] }>()

const items = ref<number[]>([])
const current = ref(Math.max(0, props.initialIndex))
let seed = 0
let timer: number | undefined

function register() {
  seed += 1
  const uid = seed
  items.value = [...items.value, uid]
  return uid
}

function unregister(uid: number) {
  items.value = items.value.filter((id) => id !== uid)
  if (current.value >= items.value.length) current.value = 0
}

provide(carouselContextKey, { register, unregister })

function goTo(index: number) {
  if (!items.value.length) return
  current.value = (index + items.value.length) % items.value.length
  emit('change', current.value)
}

function next() {
  goTo(current.value + 1)
}

function prev() {
  goTo(current.value - 1)
}

function stopAutoplay() {
  if (timer) {
    window.clearInterval(timer)
    timer = undefined
  }
}

function startAutoplay() {
  stopAutoplay()
  if (props.autoplay && items.value.length > 1) {
    timer = window.setInterval(next, props.interval)
  }
}

onMounted(startAutoplay)
onBeforeUnmount(stopAutoplay)

watch(
  () => [props.autoplay, props.interval, items.value.length],
  () => startAutoplay(),
)

watch(current, () => startAutoplay())
</script>

<template>
  <div
    class="momo-carousel"
    :class="`momo-carousel--arrow-${arrow}`"
    :style="{ height: addUnit(height) }"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <div
      class="momo-carousel__track"
      :style="{ transform: `translateX(-${current * 100}%)` }"
    >
      <slot />
    </div>

    <button
      v-if="arrow !== 'never'"
      type="button"
      class="momo-carousel__arrow is-left"
      @click="prev"
    >
      <MomoIcon name="chevron-left" :size="18" />
    </button>
    <button
      v-if="arrow !== 'never'"
      type="button"
      class="momo-carousel__arrow is-right"
      @click="next"
    >
      <MomoIcon name="chevron-right" :size="18" />
    </button>

    <div v-if="indicator" class="momo-carousel__indicators">
      <span
        v-for="(_, index) in items"
        :key="index"
        class="momo-carousel__indicator"
        :class="{ 'is-active': index === current }"
        @click="goTo(index)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.momo-carousel {
  position: relative;
  overflow: hidden;
  background: var(--momo-bg-soft);
  border: var(--momo-border-width) solid var(--momo-border-color);
  border-radius: var(--momo-radius-lg);
  box-shadow: var(--momo-shadow-base);

  &__track {
    display: flex;
    height: 100%;
    transition: transform 0.5s var(--momo-ease-out);
  }

  &__arrow {
    position: absolute;
    top: 50%;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    color: var(--momo-text-primary);
    cursor: pointer;
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: 50%;
    box-shadow: var(--momo-shadow-sm);
    outline: none;
    transform: translateY(-50%);
    transition: var(--momo-transition);

    &:hover {
      color: var(--momo-text-inverse);
      background: var(--momo-color-primary);
      transform: translateY(-50%) scale(1.08);
    }

    &.is-left {
      left: 14px;
    }

    &.is-right {
      right: 14px;
    }
  }

  &--arrow-hover &__arrow {
    opacity: 0;
  }

  &--arrow-hover:hover &__arrow {
    opacity: 1;
  }

  &__indicators {
    position: absolute;
    left: 50%;
    bottom: 14px;
    z-index: 2;
    display: flex;
    gap: 7px;
    padding: 6px 10px;
    background: var(--momo-bg-card);
    border: 1.5px solid var(--momo-border-color);
    border-radius: var(--momo-radius-round);
    box-shadow: var(--momo-shadow-xs);
    transform: translateX(-50%);
  }

  &__indicator {
    width: 8px;
    height: 8px;
    background: var(--momo-border-soft);
    border-radius: var(--momo-radius-round);
    cursor: pointer;
    transition: var(--momo-transition);

    &.is-active {
      width: 20px;
      background: var(--momo-color-primary);
    }
  }
}
</style>

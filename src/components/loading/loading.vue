<script lang="ts">
export interface LoadingProps {
  size?: number
  text?: string
  fullscreen?: boolean
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'MomoLoading' })

const props = withDefaults(defineProps<LoadingProps>(), {
  size: 36,
  text: '',
  fullscreen: false,
})

const dotSize = computed(() => Math.max(6, Math.round(props.size * 0.26)))

const loaderStyle = computed(() => ({
  '--momo-loading-size': `${props.size}px`,
  '--momo-loading-dot': `${dotSize.value}px`,
}))
</script>

<template>
  <div v-if="fullscreen" class="momo-loading-fullscreen">
    <div class="momo-loading" :style="loaderStyle">
      <div class="momo-loading__dots">
        <span class="momo-loading__dot" />
        <span class="momo-loading__dot" />
        <span class="momo-loading__dot" />
      </div>
      <div v-if="text" class="momo-loading__text">{{ text }}</div>
    </div>
  </div>

  <div v-else class="momo-loading" :style="loaderStyle">
    <div class="momo-loading__dots">
      <span class="momo-loading__dot" />
      <span class="momo-loading__dot" />
      <span class="momo-loading__dot" />
    </div>
    <div v-if="text" class="momo-loading__text">{{ text }}</div>
  </div>
</template>

<style lang="scss">
.momo-loading {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  &__dots {
    display: flex;
    align-items: center;
    gap: calc(var(--momo-loading-dot, 9px) * 0.6);
  }

  &__dot {
    width: var(--momo-loading-dot, 9px);
    height: var(--momo-loading-dot, 9px);
    background: var(--momo-color-primary);
    border: 1.5px solid var(--momo-border-color);
    border-radius: 50%;
    animation: momo-loading-bounce 0.9s var(--momo-ease-bounce) infinite both;

    &:nth-child(2) {
      animation-delay: 0.12s;
      background: var(--momo-color-warning);
    }

    &:nth-child(3) {
      animation-delay: 0.24s;
      background: var(--momo-color-success);
    }
  }

  &__text {
    font-size: var(--momo-font-size-sm);
    font-weight: 700;
    color: var(--momo-text-secondary);
  }
}

.momo-loading-fullscreen {
  position: fixed;
  inset: 0;
  z-index: var(--momo-z-loading, 3300);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--momo-bg-mask);
  backdrop-filter: blur(2px);
}

.momo-loading-mask {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--momo-bg-mask);
  border-radius: inherit;
  backdrop-filter: blur(2px);
  animation: momo-fade-in 0.18s ease;
}

@keyframes momo-loading-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0) scale(0.9);
  }

  40% {
    transform: translateY(-70%) scale(1.05);
  }
}
</style>

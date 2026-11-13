<script lang="ts">
export interface StepProps {
  title?: string
  description?: string
  icon?: string
  status?: 'wait' | 'process' | 'finish' | 'error'
}
</script>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import MomoIcon from '../icon/icon.vue'
import { stepsContextKey } from './context'

defineOptions({ name: 'MomoStep' })

const props = withDefaults(defineProps<StepProps>(), {})

const steps = inject(stepsContextKey, null)
const index = ref(0)
let uid = 0

const status = computed(() => {
  if (props.status) return props.status
  const active = steps?.active.value ?? 0
  if (index.value < active) return 'finish'
  if (index.value === active) return 'process'
  return 'wait'
})

onMounted(() => {
  if (steps) {
    const result = steps.register()
    index.value = result.index
    uid = result.uid
  }
})

onBeforeUnmount(() => {
  if (uid) steps?.unregister(uid)
})
</script>

<template>
  <div
    class="momo-step"
    :class="[
      `is-${status}`,
      steps?.direction.value === 'vertical' ? 'is-vertical' : 'is-horizontal',
      { 'is-last': false },
    ]"
  >
    <div class="momo-step__head">
      <span class="momo-step__icon">
        <MomoIcon v-if="status === 'finish'" name="check" :size="16" />
        <MomoIcon v-else-if="status === 'error'" name="close" :size="16" />
        <MomoIcon v-else-if="icon" :name="icon" :size="16" />
        <template v-else>{{ index + 1 }}</template>
      </span>
      <span class="momo-step__line" />
    </div>
    <div class="momo-step__main">
      <div v-if="title || $slots.title" class="momo-step__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="description || $slots.description" class="momo-step__desc">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.momo-step {
  position: relative;
  flex: 1;
  display: flex;
  gap: 12px;

  &__head {
    display: flex;
    flex: none;
    align-items: center;
  }

  &__icon {
    position: relative;
    z-index: 1;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: var(--momo-font-size-sm);
    font-weight: 800;
    color: var(--momo-text-secondary);
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: 50%;
    box-shadow: var(--momo-shadow-xs);
    transition: var(--momo-transition);
  }

  &__line {
    flex: 1;
    background: var(--momo-border-soft);
    border-radius: var(--momo-radius-round);
  }

  &__main {
    padding-top: 3px;
    padding-bottom: 8px;
  }

  &__title {
    font-size: var(--momo-font-size-base);
    font-weight: 700;
    color: var(--momo-text-secondary);
  }

  &__desc {
    margin-top: 2px;
    font-size: var(--momo-font-size-xs);
    color: var(--momo-text-placeholder);
  }

  &.is-process &__icon {
    color: var(--momo-text-inverse);
    background: var(--momo-color-primary);
    border-color: var(--momo-color-primary-dark);
    animation: momo-jelly 2.4s ease-in-out infinite;
  }

  &.is-process &__title {
    color: var(--momo-color-primary-dark);
  }

  &.is-finish &__icon {
    color: var(--momo-text-inverse);
    background: var(--momo-color-success);
    border-color: #15944d;
  }

  &.is-finish &__line {
    background: var(--momo-color-success);
  }

  &.is-error &__icon {
    color: var(--momo-text-inverse);
    background: var(--momo-color-danger);
    border-color: #c92f3d;
  }

  &.is-horizontal {
    flex-direction: column;
    gap: 8px;
    padding-right: 12px;

    .momo-step__head {
      width: 100%;
    }

    .momo-step__line {
      height: 3px;
      margin-left: 8px;
    }
  }

  &.is-horizontal:last-child .momo-step__line {
    display: none;
  }

  &.is-vertical {
    gap: 12px;
    padding-bottom: 28px;

    .momo-step__head {
      flex-direction: column;
      align-self: stretch;
    }

    .momo-step__line {
      width: 3px;
      margin: 4px 0;
      min-height: 26px;
    }

    &:last-child {
      padding-bottom: 0;
    }

    &:last-child .momo-step__line {
      display: none;
    }
  }
}
</style>

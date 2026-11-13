<script lang="ts">
export interface ResultProps {
  status?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  subTitle?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoResult' })

const props = withDefaults(defineProps<ResultProps>(), {
  status: 'info',
  title: '',
  subTitle: '',
})

const iconName = computed(() => {
  const map: Record<string, string> = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  }
  return map[props.status]
})
</script>

<template>
  <div class="momo-result" :class="`momo-result--${status}`">
    <div class="momo-result__icon">
      <MomoIcon :name="iconName" :size="46" />
    </div>

    <div v-if="title || $slots.title" class="momo-result__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div v-if="subTitle || $slots.subtitle" class="momo-result__subtitle">
      <slot name="subtitle">{{ subTitle }}</slot>
    </div>

    <div v-if="$slots.extra" class="momo-result__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<style lang="scss">
.momo-result {
  --momo-result-color: var(--momo-color-info);
  --momo-result-soft: var(--momo-color-info-soft);

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  text-align: center;

  &--success {
    --momo-result-color: var(--momo-color-success);
    --momo-result-soft: var(--momo-color-success-soft);
  }

  &--warning {
    --momo-result-color: var(--momo-color-warning);
    --momo-result-soft: var(--momo-color-warning-soft);
  }

  &--error {
    --momo-result-color: var(--momo-color-danger);
    --momo-result-soft: var(--momo-color-danger-soft);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 96px;
    margin-bottom: 20px;
    color: var(--momo-result-color);
    background: var(--momo-result-soft);
    border: var(--momo-border-width) solid var(--momo-result-color);
    border-radius: 50%;
    box-shadow: var(--momo-shadow-base);
    animation: momo-pop-in 0.4s var(--momo-ease-bounce);
  }

  &__title {
    font-size: var(--momo-font-size-xl);
    font-weight: 800;
    color: var(--momo-text-primary);
  }

  &__subtitle {
    max-width: 520px;
    margin-top: 8px;
    font-size: var(--momo-font-size-sm);
    line-height: 1.6;
    color: var(--momo-text-secondary);
  }

  &__extra {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }
}
</style>

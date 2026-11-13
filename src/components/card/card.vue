<script lang="ts">
export interface CardProps {
  title?: string
  shadow?: 'always' | 'hover' | 'never'
  bordered?: boolean
  padding?: string
}
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

defineOptions({ name: 'MomoCard' })

const props = withDefaults(defineProps<CardProps>(), {
  shadow: 'always',
  bordered: true,
  padding: '18px',
})

const slots = useSlots()

const hasHeader = computed(
  () => !!props.title || !!slots.header || !!slots.extra,
)

const bodyStyle = computed(() => ({ padding: props.padding }))
</script>

<template>
  <div
    class="momo-card"
    :class="[`momo-card--shadow-${shadow}`, { 'is-bordered': bordered }]"
  >
    <div v-if="hasHeader" class="momo-card__header">
      <slot name="header">
        <span class="momo-card__title">{{ title }}</span>
      </slot>
      <div v-if="$slots.extra" class="momo-card__extra">
        <slot name="extra" />
      </div>
    </div>
    <div class="momo-card__body" :style="bodyStyle">
      <slot />
    </div>
    <div v-if="$slots.footer" class="momo-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss">
.momo-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--momo-bg-card);
  border-radius: var(--momo-radius-lg);
  transition: var(--momo-transition);

  &.is-bordered {
    border: var(--momo-border-width) solid var(--momo-border-color);
  }

  &--shadow-always {
    box-shadow: var(--momo-shadow-base);
  }

  &--shadow-hover {
    box-shadow: var(--momo-shadow-xs);

    &:hover {
      transform: translate(-2px, -2px) rotate(-0.3deg);
      box-shadow: var(--momo-shadow-lg);
    }
  }

  &--shadow-never {
    box-shadow: none;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 18px;
    border-bottom: var(--momo-border-width) dashed var(--momo-border-soft);
  }

  &__title {
    font-size: var(--momo-font-size-lg);
    font-weight: 700;
    color: var(--momo-text-primary);
  }

  &__extra {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__body {
    flex: 1;
    min-height: 0;
  }

  &__footer {
    padding: 14px 18px;
    border-top: var(--momo-border-width) dashed var(--momo-border-soft);
  }
}
</style>

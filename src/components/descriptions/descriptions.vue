<script lang="ts">
export interface DescriptionItem {
  label: string
  value?: string | number
  span?: number
}

export interface DescriptionsProps {
  title?: string
  items?: DescriptionItem[]
  column?: number
  border?: boolean
  direction?: 'horizontal' | 'vertical'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'MomoDescriptions' })

const props = withDefaults(defineProps<DescriptionsProps>(), {
  items: () => [],
  column: 3,
  border: false,
  direction: 'horizontal',
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${Math.max(1, props.column)}, minmax(0, 1fr))`,
}))
</script>

<template>
  <div
    class="momo-descriptions"
    :class="[
      { 'is-border': border },
      `momo-descriptions--${direction}`,
    ]"
  >
    <div v-if="title || $slots.title" class="momo-descriptions__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="momo-descriptions__body" :style="gridStyle">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="momo-descriptions__item"
        :style="{ gridColumn: `span ${item.span ?? 1}` }"
      >
        <div class="momo-descriptions__label">{{ item.label }}</div>
        <div class="momo-descriptions__value">{{ item.value }}</div>
      </div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.momo-descriptions {
  width: 100%;
  font-size: var(--momo-font-size-sm);

  &__title {
    margin-bottom: 12px;
    font-size: var(--momo-font-size-lg);
    font-weight: 700;
    color: var(--momo-text-primary);
  }

  &__body {
    display: grid;
    gap: 1px;
    overflow: hidden;
    background: var(--momo-border-soft);
    border-radius: var(--momo-radius-base);
  }

  &.is-border &__body {
    border: var(--momo-border-width) solid var(--momo-border-color);
    box-shadow: var(--momo-shadow-xs);
  }

  &:not(.is-border) &__body {
    background: transparent;
    gap: 14px 24px;
  }

  &__item {
    display: flex;
    gap: 10px;
    padding: 12px 14px;
    background: var(--momo-bg-card);
  }

  &--vertical &__item {
    flex-direction: column;
    gap: 4px;
  }

  &:not(.is-border) &__item {
    padding: 0;
    background: transparent;
  }

  &__label {
    flex: none;
    min-width: 72px;
    font-weight: 700;
    color: var(--momo-text-secondary);
  }

  &__value {
    flex: 1;
    min-width: 0;
    color: var(--momo-text-primary);
    word-break: break-word;
  }

  &--vertical &__label {
    min-width: 0;
  }
}
</style>

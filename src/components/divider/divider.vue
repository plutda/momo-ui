<script lang="ts">
export interface DividerProps {
  direction?: 'horizontal' | 'vertical'
  dashed?: boolean
  contentPosition?: 'left' | 'center' | 'right'
}
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

defineOptions({ name: 'MomoDivider' })

const props = withDefaults(defineProps<DividerProps>(), {
  direction: 'horizontal',
  dashed: false,
  contentPosition: 'center',
})

const slots = useSlots()
const hasContent = computed(() => !!slots.default)
</script>

<template>
  <div
    v-if="direction === 'vertical'"
    class="momo-divider momo-divider--vertical"
    :class="{ 'is-dashed': dashed }"
  />
  <div
    v-else
    class="momo-divider momo-divider--horizontal"
    :class="{ 'is-dashed': dashed, 'has-content': hasContent }"
  >
    <span
      class="momo-divider__line"
      :class="`is-${contentPosition}-start`"
    />
    <span v-if="hasContent" class="momo-divider__text"><slot /></span>
    <span class="momo-divider__line" :class="`is-${contentPosition}-end`" />
  </div>
</template>

<style lang="scss">
.momo-divider {
  flex: none;

  &--vertical {
    display: inline-block;
    width: 0;
    height: 1em;
    margin: 0 10px;
    vertical-align: middle;
    border-left: var(--momo-border-width) solid var(--momo-border-soft);

    &.is-dashed {
      border-left-style: dashed;
    }
  }

  &--horizontal {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 20px 0;
  }

  &__line {
    flex: 1;
    height: 0;
    border-top: var(--momo-border-width) solid var(--momo-border-soft);

    &.is-left-start,
    &.is-right-end {
      flex: 0.15;
    }

    &.is-right-start,
    &.is-left-end {
      flex: 1;
    }
  }

  &.is-dashed &__line {
    border-top-style: dashed;
  }

  &__text {
    padding: 0 12px;
    font-size: var(--momo-font-size-sm);
    font-weight: 700;
    color: var(--momo-text-secondary);
    white-space: nowrap;
  }

  &.has-content {
    margin: 24px 0;
  }
}
</style>

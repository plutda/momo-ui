<script lang="ts">
export interface CollapseItemProps {
  name: string | number
  title?: string
  disabled?: boolean
}
</script>

<script setup lang="ts">
import { computed, inject } from 'vue'
import MomoIcon from '../icon/icon.vue'
import { collapseContextKey } from './context'

defineOptions({ name: 'MomoCollapseItem' })

const props = defineProps<CollapseItemProps>()
const collapse = inject(collapseContextKey, null)

const isActive = computed(
  () => !!collapse?.activeNames.value.includes(props.name),
)

function handleClick() {
  if (props.disabled) return
  collapse?.toggle(props.name)
}
</script>

<template>
  <div
    class="momo-collapse-item"
    :class="{ 'is-active': isActive, 'is-disabled': disabled }"
  >
    <div class="momo-collapse-item__header" @click="handleClick">
      <span class="momo-collapse-item__title">
        <slot name="title">{{ title }}</slot>
      </span>
      <MomoIcon
        name="chevron-down"
        :size="16"
        class="momo-collapse-item__arrow"
        :class="{ 'is-open': isActive }"
      />
    </div>
    <div class="momo-collapse-item__wrap" :class="{ 'is-open': isActive }">
      <div class="momo-collapse-item__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.momo-collapse-item {
  & + & {
    border-top: 1.5px dashed var(--momo-border-soft);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 18px;
    cursor: pointer;
    transition: background 0.16s;

    &:hover {
      background: var(--momo-bg-soft);
    }
  }

  &__title {
    font-size: var(--momo-font-size-base);
    font-weight: 700;
    color: var(--momo-text-primary);
  }

  &__arrow {
    color: var(--momo-text-secondary);
    transition: transform 0.3s var(--momo-ease-bounce);
    transform-origin: center;

    &.is-open {
      transform: rotate(180deg);
      color: var(--momo-color-primary);
    }
  }

  &__wrap {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s var(--momo-ease-bounce);

    &.is-open {
      grid-template-rows: 1fr;
    }
  }

  &__content {
    overflow: hidden;
    padding: 0 18px;
    font-size: var(--momo-font-size-sm);
    color: var(--momo-text-regular);

    .momo-collapse-item__wrap.is-open & {
      padding-bottom: 16px;
    }
  }

  &.is-disabled {
    opacity: 0.5;

    .momo-collapse-item__header {
      cursor: not-allowed;
    }
  }
}
</style>

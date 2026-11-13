<script lang="ts">
export interface MenuItemProps {
  index: string
  disabled?: boolean
  icon?: string
}
</script>

<script setup lang="ts">
import { computed, inject } from 'vue'
import MomoIcon from '../icon/icon.vue'
import { menuContextKey } from './context'

defineOptions({ name: 'MomoMenuItem' })

const props = withDefaults(defineProps<MenuItemProps>(), {
  disabled: false,
})

const menu = inject(menuContextKey, null)

const isActive = computed(() => menu?.activeIndex.value === props.index)

function handleClick() {
  if (props.disabled) return
  menu?.select(props.index)
}
</script>

<template>
  <li
    class="momo-menu-item"
    :class="{ 'is-active': isActive, 'is-disabled': disabled }"
    @click="handleClick"
  >
    <MomoIcon v-if="icon" :name="icon" :size="16" />
    <slot />
  </li>
</template>

<style lang="scss">
.momo-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  font-size: var(--momo-font-size-sm);
  font-weight: 700;
  color: var(--momo-text-regular);
  white-space: nowrap;
  border-radius: var(--momo-radius-base);
  cursor: pointer;
  list-style: none;
  transition: var(--momo-transition);

  &:hover:not(.is-disabled) {
    color: var(--momo-color-primary-dark);
    background: var(--momo-bg-hover);
  }

  &.is-active {
    color: var(--momo-text-inverse);
    background: var(--momo-color-primary);
    box-shadow: var(--momo-shadow-xs);
  }

  &.is-disabled {
    color: var(--momo-text-placeholder);
    cursor: not-allowed;
  }
}
</style>

<script lang="ts">
export interface DropdownItemProps {
  command?: string | number | Record<string, any>
  label?: string
  disabled?: boolean
  divided?: boolean
  icon?: string
}
</script>

<script setup lang="ts">
import { inject } from 'vue'
import MomoIcon from '../icon/icon.vue'
import { dropdownContextKey } from './context'

defineOptions({ name: 'MomoDropdownItem' })

const props = withDefaults(defineProps<DropdownItemProps>(), {
  disabled: false,
  divided: false,
})

const dropdown = inject(dropdownContextKey, null)

function handleClick() {
  if (props.disabled) return
  if (props.command !== undefined) dropdown?.execute(props.command)
  else dropdown?.close()
}
</script>

<template>
  <div
    class="momo-dropdown-item"
    :class="{ 'is-disabled': disabled, 'is-divided': divided }"
    @click="handleClick"
  >
    <MomoIcon v-if="icon" :name="icon" :size="15" class="momo-dropdown-item__icon" />
    <slot>{{ label }}</slot>
  </div>
</template>

<style lang="scss">
.momo-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: var(--momo-font-size-sm);
  font-weight: 600;
  color: var(--momo-text-primary);
  border-radius: var(--momo-radius-sm);
  cursor: pointer;
  transition: var(--momo-transition-fast);
  white-space: nowrap;

  &:hover:not(.is-disabled) {
    color: var(--momo-color-primary-dark);
    background: var(--momo-color-primary-soft);
    transform: translateX(2px);
  }

  &__icon {
    color: var(--momo-text-secondary);
  }

  &.is-divided {
    margin-top: 5px;
    padding-top: 10px;
    border-top: 1.5px dashed var(--momo-border-soft);
    border-radius: 0 0 var(--momo-radius-sm) var(--momo-radius-sm);
  }

  &.is-disabled {
    color: var(--momo-text-placeholder);
    cursor: not-allowed;
  }
}
</style>

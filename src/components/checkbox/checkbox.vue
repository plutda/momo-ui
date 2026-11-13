<script lang="ts">
export interface CheckboxProps {
  value: string | number | boolean
  label?: string
  disabled?: boolean
  indeterminate?: boolean
}
</script>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { checkboxGroupKey } from './context'

defineOptions({ name: 'MomoCheckbox' })

const props = defineProps<CheckboxProps>()
const group = inject(checkboxGroupKey, null)

const isDisabled = computed(() => props.disabled || !!group?.disabled.value)
const isChecked = computed(() => {
  if (!group) return false
  return group.modelValue.value.includes(props.value)
})
const isIndeterminate = computed(() => !!props.indeterminate && !isChecked.value)

function handleChange(event: Event) {
  if (isDisabled.value || !group) return
  const checked = (event.target as HTMLInputElement).checked
  group.change(props.value, checked)
}
</script>

<template>
  <label
    class="momo-checkbox"
    :class="{
      'is-checked': isChecked,
      'is-indeterminate': isIndeterminate,
      'is-disabled': isDisabled,
    }"
  >
    <input
      class="momo-checkbox__native"
      type="checkbox"
      :value="value"
      :checked="isChecked"
      :disabled="isDisabled"
      @change="handleChange"
    />
    <span class="momo-checkbox__box">
      <span class="momo-checkbox__mark" />
    </span>
    <span class="momo-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style lang="scss">
.momo-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--momo-font-size-base);
  color: var(--momo-text-primary);
  cursor: pointer;
  user-select: none;

  &__native {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  &__box {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-xs);
    box-shadow: var(--momo-shadow-xs);
    transition: var(--momo-transition);
  }

  &__mark {
    width: 10px;
    height: 6px;
    border: solid var(--momo-text-inverse);
    border-width: 0 0 2.5px 2.5px;
    transform: rotate(-45deg) scale(0) translateY(-1px);
    transition: transform 0.22s var(--momo-ease-bounce);
  }

  &:hover:not(.is-disabled) .momo-checkbox__box {
    transform: translateY(-1px) scale(1.06);
    box-shadow: var(--momo-shadow-sm);
  }

  &.is-checked .momo-checkbox__box,
  &.is-indeterminate .momo-checkbox__box {
    background: var(--momo-color-primary);
    border-color: var(--momo-color-primary-dark);
  }

  &.is-checked .momo-checkbox__mark {
    transform: rotate(-45deg) scale(1) translateY(-1px);
  }

  &.is-indeterminate .momo-checkbox__mark {
    width: 10px;
    height: 0;
    border-width: 0 0 2.5px 0;
    transform: rotate(0) scale(1);
  }

  &.is-disabled {
    color: var(--momo-text-placeholder);
    cursor: not-allowed;

    .momo-checkbox__box {
      background: var(--momo-bg-disabled);
      box-shadow: none;
    }
  }
}
</style>

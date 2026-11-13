<script lang="ts">
export interface RadioProps {
  value: string | number | boolean
  label?: string
  disabled?: boolean
}
</script>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { radioGroupKey } from './context'

defineOptions({ name: 'MomoRadio' })

const props = defineProps<RadioProps>()
const group = inject(radioGroupKey, null)

const isDisabled = computed(() => props.disabled || !!group?.disabled.value)
const isChecked = computed(() => {
  if (!group) return false
  return group.modelValue.value === props.value
})

function handleChange() {
  if (isDisabled.value || !group) return
  group.change(props.value)
}
</script>

<template>
  <label
    class="momo-radio"
    :class="{ 'is-checked': isChecked, 'is-disabled': isDisabled }"
  >
    <input
      class="momo-radio__native"
      type="radio"
      :name="group?.name.value"
      :value="value"
      :checked="isChecked"
      :disabled="isDisabled"
      @change="handleChange"
    />
    <span class="momo-radio__dot">
      <span class="momo-radio__inner" />
    </span>
    <span class="momo-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style lang="scss">
.momo-radio {
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

  &__dot {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: 50%;
    box-shadow: var(--momo-shadow-xs);
    transition: var(--momo-transition);
  }

  &__inner {
    width: 10px;
    height: 10px;
    background: var(--momo-color-primary);
    border-radius: 50%;
    transform: scale(0);
    transition: transform 0.24s var(--momo-ease-bounce);
  }

  &__label {
    line-height: 1.4;
  }

  &:hover:not(.is-disabled) .momo-radio__dot {
    transform: translateY(-1px) scale(1.06);
    box-shadow: var(--momo-shadow-sm);
  }

  &.is-checked {
    .momo-radio__dot {
      border-color: var(--momo-color-primary);
      background: var(--momo-color-primary-soft);
    }

    .momo-radio__inner {
      transform: scale(1);
    }
  }

  &.is-disabled {
    color: var(--momo-text-placeholder);
    cursor: not-allowed;

    .momo-radio__dot {
      background: var(--momo-bg-disabled);
      box-shadow: none;
      opacity: 0.7;
    }
  }
}
</style>

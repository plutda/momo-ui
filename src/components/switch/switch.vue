<script lang="ts">
export interface SwitchProps {
  modelValue?: boolean
  activeValue?: boolean | string | number
  inactiveValue?: boolean | string | number
  disabled?: boolean
  loading?: boolean
  size?: 'small' | 'default' | 'large'
  activeText?: string
  inactiveText?: string
  activeColor?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'MomoSwitch' })

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  activeValue: true,
  inactiveValue: false,
  disabled: false,
  loading: false,
  size: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | string | number]
  change: [value: boolean | string | number]
}>()

const isChecked = computed(() =>
  typeof props.modelValue === 'boolean'
    ? props.modelValue
    : props.modelValue === props.activeValue,
)

const btnStyle = computed(() =>
  isChecked.value && props.activeColor
    ? { background: props.activeColor, borderColor: props.activeColor }
    : undefined,
)

function toggle() {
  if (props.disabled || props.loading) return
  const next = isChecked.value ? props.inactiveValue : props.activeValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <button
    type="button"
    class="momo-switch"
    :class="[
      `momo-switch--${size}`,
      { 'is-checked': isChecked, 'is-disabled': disabled, 'is-loading': loading },
    ]"
    role="switch"
    :aria-checked="isChecked"
    :disabled="disabled || loading"
    :style="btnStyle"
    @click="toggle"
  >
    <span v-if="activeText || inactiveText" class="momo-switch__text">
      {{ isChecked ? activeText : inactiveText }}
    </span>
    <span class="momo-switch__handle">
      <span v-if="loading" class="momo-switch__loading" />
    </span>
  </button>
</template>

<style lang="scss">
.momo-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 54px;
  height: 30px;
  padding: 0 3px;
  background: var(--momo-bg-disabled);
  border: var(--momo-border-width) solid var(--momo-border-color);
  border-radius: var(--momo-radius-round);
  box-shadow: var(--momo-shadow-xs);
  cursor: pointer;
  outline: none;
  transition: var(--momo-transition);

  &:focus-visible {
    outline: 3px solid var(--momo-color-primary-soft);
    outline-offset: 2px;
  }

  &__handle {
    position: absolute;
    left: 3px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: 50%;
    box-shadow: var(--momo-shadow-xs);
    transition: left 0.26s var(--momo-ease-bounce);
  }

  &__text {
    width: 100%;
    padding: 0 8px;
    font-size: var(--momo-font-size-xs);
    font-weight: 700;
    color: var(--momo-text-inverse);
    text-align: right;
    line-height: 1;
    white-space: nowrap;
    pointer-events: none;
  }

  &__loading {
    width: 10px;
    height: 10px;
    border: 2px solid var(--momo-color-primary);
    border-top-color: transparent;
    border-radius: 50%;
    animation: momo-spin 0.8s linear infinite;
  }

  &.is-checked {
    background: var(--momo-color-primary);

    .momo-switch__handle {
      left: calc(100% - 23px);
    }

    .momo-switch__text {
      color: var(--momo-text-inverse);
      text-align: left;
    }
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.55;
    box-shadow: none;
  }

  &--small {
    width: 42px;
    height: 24px;

    .momo-switch__handle {
      width: 16px;
      height: 16px;
    }

    &.is-checked .momo-switch__handle {
      left: calc(100% - 19px);
    }
  }

  &--large {
    width: 66px;
    height: 36px;

    .momo-switch__handle {
      width: 26px;
      height: 26px;
    }

    &.is-checked .momo-switch__handle {
      left: calc(100% - 29px);
    }
  }
}
</style>

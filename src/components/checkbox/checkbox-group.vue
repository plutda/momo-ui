<script lang="ts">
export interface CheckboxGroupProps {
  modelValue?: Array<string | number | boolean>
  disabled?: boolean
  direction?: 'horizontal' | 'vertical'
}
</script>

<script setup lang="ts">
import { provide, toRef } from 'vue'
import { checkboxGroupKey } from './context'

defineOptions({ name: 'MomoCheckboxGroup' })

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  modelValue: () => [],
  disabled: false,
  direction: 'horizontal',
})

const emit = defineEmits<{
  'update:modelValue': [value: Array<string | number | boolean>]
  change: [value: Array<string | number | boolean>]
}>()

provide(checkboxGroupKey, {
  modelValue: toRef(props, 'modelValue'),
  disabled: toRef(props, 'disabled'),
  change: (value, checked) => {
    const next = checked
      ? [...props.modelValue, value]
      : props.modelValue.filter((v) => v !== value)
    emit('update:modelValue', next)
    emit('change', next)
  },
})
</script>

<template>
  <div class="momo-checkbox-group" :class="`momo-checkbox-group--${direction}`">
    <slot />
  </div>
</template>

<style lang="scss">
.momo-checkbox-group {
  display: flex;
  gap: 20px;

  &--vertical {
    flex-direction: column;
    gap: 12px;
  }
}
</style>

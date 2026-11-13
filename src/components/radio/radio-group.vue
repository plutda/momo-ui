<script lang="ts">
export interface RadioGroupProps {
  modelValue?: string | number | boolean
  disabled?: boolean
  name?: string
  direction?: 'horizontal' | 'vertical'
}
</script>

<script setup lang="ts">
import { provide, toRef } from 'vue'
import { radioGroupKey } from './context'

defineOptions({ name: 'MomoRadioGroup' })

const props = withDefaults(defineProps<RadioGroupProps>(), {
  disabled: false,
  direction: 'horizontal',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  change: [value: string | number | boolean]
}>()

provide(radioGroupKey, {
  modelValue: toRef(props, 'modelValue'),
  disabled: toRef(props, 'disabled'),
  name: toRef(props, 'name'),
  change: (value: any) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})
</script>

<template>
  <div class="momo-radio-group" :class="`momo-radio-group--${direction}`">
    <slot />
  </div>
</template>

<style lang="scss">
.momo-radio-group {
  display: flex;
  gap: 20px;

  &--vertical {
    flex-direction: column;
    gap: 12px;
  }
}
</style>

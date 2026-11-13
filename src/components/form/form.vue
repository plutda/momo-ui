<script lang="ts">
import type { FormRule } from '../../utils/validate'

export interface FormProps {
  model: Record<string, any>
  rules?: Record<string, FormRule[]>
  labelWidth?: string
  labelPosition?: 'left' | 'top'
  size?: 'small' | 'default' | 'large'
  disabled?: boolean
  scrollToError?: boolean
}
</script>

<script setup lang="ts">
import { provide, ref } from 'vue'
import { formContextKey, type FormContext, type FormItemInstance } from './context'

defineOptions({ name: 'MomoForm' })

const props = withDefaults(defineProps<FormProps>(), {
  labelWidth: '100px',
  labelPosition: 'left',
  size: 'default',
  disabled: false,
  scrollToError: true,
})

const emit = defineEmits<{
  submit: [event: Event]
  reset: [event: Event]
}>()

const items = ref<FormItemInstance[]>([])

const context: FormContext = {
  get model() {
    return props.model
  },
  get rules() {
    return props.rules
  },
  get labelWidth() {
    return props.labelWidth
  },
  get labelPosition() {
    return props.labelPosition
  },
  get size() {
    return props.size
  },
  get disabled() {
    return props.disabled
  },
  get scrollToError() {
    return props.scrollToError
  },
  registerItem(item) {
    if (!items.value.includes(item)) items.value.push(item)
  },
  unregisterItem(item) {
    items.value = items.value.filter((it) => it !== item)
  },
}

provide(formContextKey, context)

async function validate(): Promise<boolean> {
  const results = await Promise.all(items.value.map((item) => item.validate()))
  return results.every(Boolean)
}

function resetFields() {
  items.value.forEach((item) => item.resetField())
}

function clearValidate() {
  items.value.forEach((item) => item.clearValidate())
}

function handleSubmit(event: Event) {
  event.preventDefault()
  emit('submit', event)
}

function handleReset(event: Event) {
  event.preventDefault()
  resetFields()
  emit('reset', event)
}

defineExpose({ validate, resetFields, clearValidate })
</script>

<template>
  <div class="momo-form" :class="`momo-form--label-${labelPosition}`">
    <form @submit="handleSubmit" @reset="handleReset">
      <slot />
    </form>
  </div>
</template>

<style lang="scss">
.momo-form {
  width: 100%;

  & > form {
    margin: 0;
  }
}
</style>

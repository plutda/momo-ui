<script lang="ts">
import type { FormRule } from '../../utils/validate'

export interface FormItemProps {
  prop?: string
  label?: string
  rules?: FormRule[]
  required?: boolean
  labelWidth?: string
  error?: string
}
</script>

<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formContextKey } from './context'
import { validateValue } from '../../utils/validate'

defineOptions({ name: 'MomoFormItem' })

const props = defineProps<FormItemProps>()

const form = inject(formContextKey, null)

const itemRef = ref<HTMLElement | null>(null)
const error = ref(props.error || '')
const validateState = ref<'idle' | 'validating' | 'error' | 'success'>('idle')

const fieldValue = computed(() => {
  if (!form || !props.prop) return undefined
  return props.prop
    .split('.')
    .reduce((obj: any, key) => (obj == null ? undefined : obj[key]), form.model)
})

const mergedRules = computed<FormRule[]>(() => {
  const rules: FormRule[] = []
  if (form?.rules && props.prop && form.rules[props.prop]) {
    rules.push(...form.rules[props.prop])
  }
  if (props.rules) rules.push(...props.rules)
  if (props.required) rules.push({ required: true })
  return rules
})

const isRequired = computed(() => mergedRules.value.some((rule) => rule.required))

const labelPosition = computed(() => form?.labelPosition ?? 'left')
const labelWidth = computed(
  () => props.labelWidth ?? form?.labelWidth ?? '100px',
)

async function validate(trigger?: 'blur' | 'change'): Promise<boolean> {
  if (!mergedRules.value.length) {
    error.value = ''
    return true
  }

  const applicable = trigger
    ? mergedRules.value.filter((rule) => {
        if (!rule.trigger) return true
        return Array.isArray(rule.trigger)
          ? rule.trigger.includes(trigger)
          : rule.trigger === trigger
      })
    : mergedRules.value

  if (!applicable.length) return true

  validateState.value = 'validating'
  const message = await validateValue(
    fieldValue.value,
    applicable,
    form?.model ?? {},
  )

  if (message) {
    error.value = message
    validateState.value = 'error'
    if (form?.scrollToError) {
      nextTick(() => {
        itemRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
    return false
  }

  error.value = ''
  validateState.value = 'success'
  return true
}

function clearValidate() {
  error.value = ''
  validateState.value = 'idle'
}

function resetField() {
  if (form && props.prop) {
    const keys = props.prop.split('.')
    let target: any = form.model
    keys.slice(0, -1).forEach((key) => {
      target = target?.[key]
    })
    if (target) target[keys[keys.length - 1]] = undefined
  }
  clearValidate()
}

function handleFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && itemRef.value?.contains(next)) return
  validate('blur')
}

watch(fieldValue, () => {
  if (error.value) validate('change')
})

watch(
  () => props.error,
  (value) => {
    if (value) {
      error.value = value
      validateState.value = 'error'
    }
  },
)

const instance = {
  prop: props.prop,
  validate,
  resetField,
  clearValidate,
}

onMounted(() => form?.registerItem(instance))
onBeforeUnmount(() => form?.unregisterItem(instance))

defineExpose({ validate, resetField, clearValidate, error })
</script>

<template>
  <div
    ref="itemRef"
    class="momo-form-item"
    :class="[
      `momo-form-item--label-${labelPosition}`,
      {
        'is-required': isRequired,
        'is-error': validateState === 'error',
        'is-success': validateState === 'success',
      },
    ]"
    @focusout="handleFocusOut"
  >
    <label
      v-if="label || $slots.label"
      class="momo-form-item__label"
      :style="labelPosition === 'left' ? { width: labelWidth } : undefined"
    >
      <slot name="label">{{ label }}</slot>
    </label>

    <div class="momo-form-item__content">
      <slot />
      <Transition name="momo-error">
        <div v-if="error" class="momo-form-item__error">{{ error }}</div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss">
.momo-form-item {
  display: flex;
  margin-bottom: 22px;

  &--label-top {
    flex-direction: column;
  }

  &__label {
    flex: none;
    padding-right: 14px;
    font-size: var(--momo-font-size-base);
    font-weight: 700;
    line-height: var(--momo-height-base);
    color: var(--momo-text-regular);
    text-align: right;

    .momo-form-item--label-top & {
      padding: 0 0 6px;
      text-align: left;
    }
  }

  &.is-required > &__label::before {
    content: '*';
    margin-right: 4px;
    color: var(--momo-color-danger);
  }

  &__content {
    position: relative;
    flex: 1;
    min-width: 0;
  }

  &__error {
    margin-top: 5px;
    font-size: var(--momo-font-size-xs);
    font-weight: 700;
    color: var(--momo-color-danger);
    animation: momo-shake 0.36s var(--momo-ease-out);
  }

  &.is-error {
    :deep(.momo-input),
    :deep(.momo-select),
    :deep(.momo-input-number) {
      border-color: var(--momo-color-danger);
    }
  }
}

.momo-error-enter-active {
  animation: momo-slide-down 0.2s var(--momo-ease-bounce);
}

.momo-error-leave-active {
  transition: opacity 0.14s;
}

.momo-error-leave-to {
  opacity: 0;
}
</style>

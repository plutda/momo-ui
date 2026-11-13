<script lang="ts">
export interface InputProps {
  modelValue?: string | number
  type?: 'text' | 'password' | 'number' | 'email' | 'tel' | 'url' | 'textarea'
  size?: 'small' | 'default' | 'large'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  showPassword?: boolean
  maxlength?: number
  showWordLimit?: boolean
  prefixIcon?: string
  suffixIcon?: string
  rows?: number
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  status?: '' | 'error' | 'warning'
  name?: string
  autofocus?: boolean
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoInput' })

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  size: 'default',
  rows: 3,
  resize: 'vertical',
  status: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  change: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  keydown: [event: KeyboardEvent]
}>()

const focused = ref(false)
const hovering = ref(false)
const passwordVisible = ref(false)

const isTextarea = computed(() => props.type === 'textarea')
const inputType = computed(() => {
  if (props.type === 'password' && props.showPassword) {
    return passwordVisible.value ? 'text' : 'password'
  }
  return props.type === 'textarea' ? 'text' : props.type
})

const value = computed(() => props.modelValue ?? '')
const showClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    String(value.value) !== '' &&
    (focused.value || hovering.value),
)
const showPasswordToggle = computed(() => props.type === 'password' && props.showPassword)
const wordCount = computed(() => String(value.value).length)

function handleInput(event: Event) {
  const v = (event.target as HTMLInputElement | HTMLTextAreaElement).value
  emit('update:modelValue', v)
  emit('input', v)
}

function handleChange(event: Event) {
  emit('change', (event.target as HTMLInputElement).value)
}

function handleFocus(event: FocusEvent) {
  focused.value = true
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  focused.value = false
  emit('blur', event)
}

function clear() {
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
}

function togglePassword() {
  passwordVisible.value = !passwordVisible.value
}
</script>

<template>
  <div
    class="momo-input"
    :class="[
      `momo-input--${size}`,
      {
        'is-disabled': disabled,
        'is-textarea': isTextarea,
        'is-error': status === 'error',
        'is-warning': status === 'warning',
      },
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <span v-if="prefixIcon || $slots.prefix" class="momo-input__prefix">
      <MomoIcon v-if="prefixIcon" :name="prefixIcon" :size="16" />
      <slot name="prefix" />
    </span>

    <textarea
      v-if="isTextarea"
      class="momo-input__control momo-input__textarea"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :rows="rows"
      :name="name"
      :style="{ resize }"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="$emit('keydown', $event)"
    />

    <input
      v-else
      class="momo-input__control"
      :type="inputType"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :name="name"
      :autofocus="autofocus"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="$emit('keydown', $event)"
    />

    <span class="momo-input__suffix">
      <MomoIcon
        v-if="showClear"
        name="close"
        :size="15"
        class="momo-input__action is-clear"
        @click.stop="clear"
      />
      <MomoIcon
        v-if="showPasswordToggle"
        :name="passwordVisible ? 'eye' : 'eye-off'"
        :size="16"
        class="momo-input__action"
        @click.stop="togglePassword"
      />
      <slot name="suffix" />
      <MomoIcon v-if="suffixIcon" :name="suffixIcon" :size="16" />
      <span v-if="showWordLimit && maxlength" class="momo-input__count">
        {{ wordCount }}/{{ maxlength }}
      </span>
    </span>
  </div>
</template>

<style lang="scss">
.momo-input {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: var(--momo-height-base);
  padding: 0 12px;
  color: var(--momo-text-primary);
  background: var(--momo-bg-card);
  border: var(--momo-border-width) solid var(--momo-border-color);
  border-radius: var(--momo-radius-base);
  box-shadow: var(--momo-shadow-xs);
  transition: var(--momo-transition);

  &:focus-within {
    border-color: var(--momo-color-primary);
    box-shadow: 0 0 0 4px var(--momo-color-primary-soft);
    transform: translateY(-1px);
  }

  &.is-error {
    border-color: var(--momo-color-danger);
    box-shadow: 0 0 0 4px var(--momo-color-danger-soft);
  }

  &.is-warning {
    border-color: var(--momo-color-warning);
    box-shadow: 0 0 0 4px var(--momo-color-warning-soft);
  }

  &.is-disabled {
    color: var(--momo-text-secondary);
    background: var(--momo-bg-disabled);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  &.is-textarea {
    align-items: flex-start;
    padding: 9px 12px;
  }

  &__control {
    flex: 1;
    width: 100%;
    min-width: 0;
    padding: 0;
    font: inherit;
    color: inherit;
    background: transparent;
    border: none;
    outline: none;

    &::placeholder {
      color: var(--momo-text-placeholder);
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  &__textarea {
    min-height: 72px;
    line-height: 1.6;
  }

  &__prefix,
  &__suffix {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    color: var(--momo-text-secondary);
  }

  &__action {
    cursor: pointer;
    transition: var(--momo-transition-fast);

    &:hover {
      color: var(--momo-color-primary);
      transform: scale(1.12);
    }

    &.is-clear:hover {
      color: var(--momo-color-danger);
    }
  }

  &__count {
    font-size: var(--momo-font-size-xs);
    color: var(--momo-text-placeholder);
    white-space: nowrap;
  }

  &--small {
    min-height: var(--momo-height-sm);
    padding: 0 10px;
    font-size: var(--momo-font-size-sm);
    border-radius: var(--momo-radius-sm);
  }

  &--large {
    min-height: var(--momo-height-lg);
    padding: 0 16px;
    font-size: var(--momo-font-size-lg);
    border-radius: var(--momo-radius-lg);
  }
}
</style>

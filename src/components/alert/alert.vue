<script lang="ts">
export interface AlertProps {
  type?: 'success' | 'info' | 'warning' | 'error'
  title?: string
  description?: string
  closable?: boolean
  showIcon?: boolean
  effect?: 'light' | 'dark'
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoAlert' })

const props = withDefaults(defineProps<AlertProps>(), {
  type: 'info',
  closable: false,
  showIcon: true,
  effect: 'light',
})

const emit = defineEmits<{ close: [event: MouseEvent] }>()

const visible = ref(true)

const iconName = computed(() => {
  const map: Record<string, string> = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error',
  }
  return map[props.type]
})

function close(event: MouseEvent) {
  visible.value = false
  emit('close', event)
}
</script>

<template>
  <Transition name="momo-alert">
    <div
      v-if="visible"
      class="momo-alert"
      :class="[`momo-alert--${type}`, `momo-alert--${effect}`]"
      role="alert"
    >
      <MomoIcon
        v-if="showIcon"
        :name="iconName"
        :size="20"
        class="momo-alert__icon"
      />
      <div class="momo-alert__content">
        <div v-if="title || $slots.title" class="momo-alert__title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="description || $slots.default" class="momo-alert__desc">
          <slot>{{ description }}</slot>
        </div>
      </div>
      <button
        v-if="closable"
        type="button"
        class="momo-alert__close"
        @click="close"
      >
        <MomoIcon name="close" :size="14" />
      </button>
    </div>
  </Transition>
</template>

<style lang="scss">
.momo-alert {
  --momo-alert-bg: var(--momo-color-info-soft);
  --momo-alert-color: #2b7de0;
  --momo-alert-border: var(--momo-color-info);

  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  color: var(--momo-alert-color);
  background: var(--momo-alert-bg);
  border: var(--momo-border-width) solid var(--momo-alert-border);
  border-radius: var(--momo-radius-base);
  box-shadow: var(--momo-shadow-sm);

  &--success {
    --momo-alert-bg: var(--momo-color-success-soft);
    --momo-alert-color: #15944d;
    --momo-alert-border: var(--momo-color-success);
  }

  &--warning {
    --momo-alert-bg: var(--momo-color-warning-soft);
    --momo-alert-color: #b87300;
    --momo-alert-border: var(--momo-color-warning);
  }

  &--error {
    --momo-alert-bg: var(--momo-color-danger-soft);
    --momo-alert-color: var(--momo-color-danger);
    --momo-alert-border: var(--momo-color-danger);
  }

  &--dark {
    --momo-alert-bg: var(--momo-color-info);
    --momo-alert-color: var(--momo-text-inverse);
    --momo-alert-border: #2b7de0;
  }

  &--dark.momo-alert--success {
    --momo-alert-bg: var(--momo-color-success);
    --momo-alert-border: #15944d;
  }

  &--dark.momo-alert--warning {
    --momo-alert-bg: var(--momo-color-warning);
    --momo-alert-border: #b87300;
  }

  &--dark.momo-alert--error {
    --momo-alert-bg: var(--momo-color-danger);
    --momo-alert-border: #c92f3d;
  }

  &__icon {
    flex: none;
    margin-top: 2px;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: var(--momo-font-size-base);
    font-weight: 700;
  }

  &__desc {
    margin-top: 3px;
    font-size: var(--momo-font-size-sm);
    line-height: 1.55;
    opacity: 0.92;
  }

  &__close {
    flex: none;
    padding: 2px;
    color: inherit;
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: 50%;
    opacity: 0.7;
    transition: 0.16s;

    &:hover {
      opacity: 1;
      transform: rotate(90deg);
    }
  }
}

.momo-alert-enter-active,
.momo-alert-leave-active {
  transition: var(--momo-transition);
}

.momo-alert-enter-from,
.momo-alert-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
</style>

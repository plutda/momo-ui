<script lang="ts">
export type NotificationType = 'success' | 'info' | 'warning' | 'error'

export interface NotificationProps {
  title?: string
  message: string
  type?: NotificationType
  duration?: number
  closable?: boolean
  showIcon?: boolean
}
</script>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoNotification' })

const props = withDefaults(defineProps<NotificationProps>(), {
  title: '',
  type: 'info',
  duration: 4500,
  closable: true,
  showIcon: true,
})

const emit = defineEmits<{ close: [] }>()

const iconMap: Record<NotificationType, string> = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error',
}

const visible = ref(true)
let timer: number | undefined

function close() {
  if (!visible.value) return
  window.clearTimeout(timer)
  visible.value = false
  window.setTimeout(() => emit('close'), 260)
}

onMounted(() => {
  if (props.duration > 0) {
    timer = window.setTimeout(close, props.duration)
  }
})

onBeforeUnmount(() => window.clearTimeout(timer))

defineExpose({ close })
</script>

<template>
  <Transition appear name="momo-notification">
    <div
      v-if="visible"
      class="momo-notification"
      :class="`momo-notification--${type}`"
      role="alert"
    >
      <div v-if="showIcon" class="momo-notification__icon">
        <MomoIcon :name="iconMap[type]" :size="20" />
      </div>

      <div class="momo-notification__body">
        <div v-if="title" class="momo-notification__title">{{ title }}</div>
        <div class="momo-notification__content">{{ message }}</div>
      </div>

      <button
        v-if="closable"
        type="button"
        class="momo-notification__close"
        @click="close"
      >
        <MomoIcon name="close" :size="14" />
      </button>
    </div>
  </Transition>
</template>

<style lang="scss">
.momo-notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: var(--momo-z-message, 3200);
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 340px;
  max-width: calc(100vw - 40px);
  pointer-events: none;
}

.momo-notification-wrapper {
  pointer-events: auto;
}

.momo-notification {
  --momo-notification-color: var(--momo-color-info);

  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 14px 16px;
  background: var(--momo-bg-card);
  border: var(--momo-border-width) solid var(--momo-border-color);
  border-radius: var(--momo-radius-base);
  box-shadow: var(--momo-shadow-base);

  &--success {
    --momo-notification-color: var(--momo-color-success);
  }

  &--warning {
    --momo-notification-color: var(--momo-color-warning);
  }

  &--error {
    --momo-notification-color: var(--momo-color-danger);
  }

  &__icon {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    color: var(--momo-notification-color);
    background: color-mix(in srgb, var(--momo-notification-color) 14%, transparent);
    border: 1.5px solid var(--momo-notification-color);
    border-radius: 12px;
  }

  &__body {
    flex: 1;
    min-width: 0;
    padding-top: 2px;
  }

  &__title {
    font-size: var(--momo-font-size-sm);
    font-weight: 800;
    color: var(--momo-text-primary);
  }

  &__content {
    margin-top: 3px;
    font-size: var(--momo-font-size-xs);
    line-height: 1.55;
    color: var(--momo-text-secondary);
    word-break: break-word;
  }

  &__close {
    flex: none;
    display: inline-flex;
    padding: 2px;
    color: var(--momo-text-placeholder);
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: 50%;
    transition: var(--momo-transition);

    &:hover {
      color: var(--momo-color-danger);
      background: var(--momo-color-danger-soft);
    }
  }
}

.momo-notification-enter-active,
.momo-notification-leave-active {
  transition: opacity 0.26s var(--momo-ease-out),
    transform 0.26s var(--momo-ease-bounce);
}

.momo-notification-enter-from,
.momo-notification-leave-to {
  opacity: 0;
  transform: translateX(24px) scale(0.94);
}
</style>

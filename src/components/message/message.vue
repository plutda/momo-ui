<script lang="ts">
export type MessageType = 'success' | 'info' | 'warning' | 'error'

export interface MessageProps {
  message: string
  type?: MessageType
  duration?: number
  closable?: boolean
  showIcon?: boolean
}
</script>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoMessage' })

const props = withDefaults(defineProps<MessageProps>(), {
  type: 'info',
  duration: 3000,
  closable: false,
  showIcon: true,
})

const emit = defineEmits<{ close: [] }>()

const iconMap: Record<MessageType, string> = {
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
  window.setTimeout(() => emit('close'), 240)
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
  <Transition appear name="momo-message">
    <div
      v-if="visible"
      class="momo-message"
      :class="`momo-message--${type}`"
      role="alert"
    >
      <MomoIcon
        v-if="showIcon"
        :name="iconMap[type]"
        :size="18"
        class="momo-message__icon"
      />
      <span class="momo-message__content">{{ message }}</span>
      <button
        v-if="closable"
        type="button"
        class="momo-message__close"
        @click="close"
      >
        <MomoIcon name="close" :size="13" />
      </button>
    </div>
  </Transition>
</template>

<style lang="scss">
.momo-message-container {
  position: fixed;
  top: 20px;
  left: 50%;
  z-index: var(--momo-z-message, 3200);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
  transform: translateX(-50%);
}

.momo-message-wrapper {
  pointer-events: auto;
}

.momo-message {
  --momo-message-color: var(--momo-color-info);
  --momo-message-soft: var(--momo-color-info-soft);

  display: flex;
  align-items: center;
  gap: 9px;
  max-width: min(560px, calc(100vw - 40px));
  padding: 10px 18px;
  font-size: var(--momo-font-size-sm);
  font-weight: 600;
  color: var(--momo-text-primary);
  background: var(--momo-bg-card);
  border: var(--momo-border-width) solid var(--momo-border-color);
  border-left: 8px solid var(--momo-message-color);
  border-radius: var(--momo-radius-pill);
  box-shadow: var(--momo-shadow-base);

  &--success {
    --momo-message-color: var(--momo-color-success);
    --momo-message-soft: var(--momo-color-success-soft);
  }

  &--warning {
    --momo-message-color: var(--momo-color-warning);
    --momo-message-soft: var(--momo-color-warning-soft);
  }

  &--error {
    --momo-message-color: var(--momo-color-danger);
    --momo-message-soft: var(--momo-color-danger-soft);
  }

  &__icon {
    flex: none;
    color: var(--momo-message-color);
  }

  &__content {
    min-width: 0;
    word-break: break-word;
  }

  &__close {
    flex: none;
    display: inline-flex;
    padding: 2px;
    margin-left: 2px;
    color: var(--momo-text-secondary);
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

.momo-message-enter-active,
.momo-message-leave-active {
  transition: opacity 0.24s var(--momo-ease-out),
    transform 0.24s var(--momo-ease-bounce);
}

.momo-message-enter-from,
.momo-message-leave-to {
  opacity: 0;
  transform: translateY(-14px) scale(0.92);
}
</style>

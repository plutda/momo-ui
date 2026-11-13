<script lang="ts">
export interface DialogProps {
  modelValue?: boolean
  title?: string
  width?: number | string
  fullscreen?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  draggable?: boolean
  lockScroll?: boolean
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import MomoIcon from '../icon/icon.vue'
import { addUnit } from '../../utils/dom'
import { lockScroll, unlockScroll } from '../../utils/scroll-lock'

defineOptions({ name: 'MomoDialog' })

const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: false,
  title: '',
  width: 520,
  fullscreen: false,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: true,
  draggable: false,
  lockScroll: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
  opened: []
  closed: []
}>()

const offset = reactive({ x: 0, y: 0 })
const dragging = ref(false)

const dialogStyle = computed(() => ({
  width: props.fullscreen ? '100vw' : addUnit(props.width),
  height: props.fullscreen ? '100vh' : undefined,
  transform: props.fullscreen
    ? undefined
    : `translate(${offset.x}px, ${offset.y}px)`,
}))

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleMaskClick() {
  if (props.closeOnClickModal) close()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnPressEscape) close()
}

let dragOrigin = { x: 0, y: 0, offsetX: 0, offsetY: 0 }

function handleDragStart(event: PointerEvent) {
  if (!props.draggable || props.fullscreen) return
  dragging.value = true
  dragOrigin = {
    x: event.clientX,
    y: event.clientY,
    offsetX: offset.x,
    offsetY: offset.y,
  }
  window.addEventListener('pointermove', handleDragMove)
  window.addEventListener('pointerup', handleDragEnd)
}

function handleDragMove(event: PointerEvent) {
  offset.x = dragOrigin.offsetX + event.clientX - dragOrigin.x
  offset.y = dragOrigin.offsetY + event.clientY - dragOrigin.y
}

function handleDragEnd() {
  dragging.value = false
  window.removeEventListener('pointermove', handleDragMove)
  window.removeEventListener('pointerup', handleDragEnd)
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      offset.x = 0
      offset.y = 0
      emit('open')
      if (props.lockScroll) lockScroll()
      document.addEventListener('keydown', handleKeydown)
      nextTick(() => emit('opened'))
    } else {
      emit('closed')
      if (props.lockScroll) unlockScroll()
      document.removeEventListener('keydown', handleKeydown)
      handleDragEnd()
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  handleDragEnd()
  if (props.modelValue && props.lockScroll) unlockScroll()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="momo-dialog">
      <div v-if="modelValue" class="momo-dialog" :class="{ 'is-fullscreen': fullscreen }">
        <div class="momo-dialog__mask" @click="handleMaskClick" />
        <div
          class="momo-dialog__panel"
          :class="{ 'is-dragging': dragging }"
          :style="dialogStyle"
          @click.stop
        >
          <div
            class="momo-dialog__header"
            :class="{ 'is-draggable': draggable && !fullscreen }"
            @pointerdown="handleDragStart"
          >
            <slot name="header">
              <h3 class="momo-dialog__title">{{ title }}</h3>
            </slot>
            <button
              v-if="showClose"
              type="button"
              class="momo-dialog__close"
              @click="close"
            >
              <MomoIcon name="close" :size="16" />
            </button>
          </div>

          <div class="momo-dialog__body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="momo-dialog__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.momo-dialog {
  position: fixed;
  inset: 0;
  z-index: var(--momo-z-dialog);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  &__mask {
    position: absolute;
    inset: 0;
    background: var(--momo-bg-mask);
    backdrop-filter: blur(3px);
  }

  &__panel {
    position: relative;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    max-height: calc(100vh - 48px);
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-xl);
    box-shadow: var(--momo-shadow-lg);
    transition: transform 0.2s var(--momo-ease-out);

    &.is-dragging {
      transition: none;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 22px 12px;

    &.is-draggable {
      cursor: grab;
      user-select: none;

      &:active {
        cursor: grabbing;
      }
    }
  }

  &__title {
    margin: 0;
    font-size: var(--momo-font-size-lg);
    font-weight: 800;
    color: var(--momo-text-primary);
  }

  &__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    color: var(--momo-text-secondary);
    cursor: pointer;
    background: var(--momo-bg-soft);
    border: 1.5px solid var(--momo-border-soft);
    border-radius: 50%;
    transition: var(--momo-transition);

    &:hover {
      color: var(--momo-text-inverse);
      background: var(--momo-color-danger);
      border-color: var(--momo-color-danger);
      transform: rotate(90deg) scale(1.06);
    }
  }

  &__body {
    flex: 1;
    padding: 6px 22px 22px;
    overflow: auto;
    font-size: var(--momo-font-size-base);
    color: var(--momo-text-regular);
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 14px 22px 20px;
    border-top: 1.5px dashed var(--momo-border-soft);
  }

  &.is-fullscreen {
    padding: 0;

    .momo-dialog__panel {
      border-radius: 0;
      box-shadow: none;
    }

    .momo-dialog__body {
      padding: 16px 24px;
    }
  }
}

.momo-dialog-enter-active,
.momo-dialog-leave-active {
  transition: opacity 0.22s var(--momo-ease-out);
}

.momo-dialog-enter-from,
.momo-dialog-leave-to {
  opacity: 0;
}

.momo-dialog-enter-active .momo-dialog__panel {
  animation: momo-pop-in 0.32s var(--momo-ease-bounce);
}

.momo-dialog-leave-active .momo-dialog__panel {
  transition: transform 0.18s, opacity 0.18s;
}

.momo-dialog-leave-to .momo-dialog__panel {
  opacity: 0;
  transform: scale(0.94);
}
</style>

<script lang="ts">
export interface DrawerProps {
  modelValue?: boolean
  title?: string
  direction?: 'rtl' | 'ltr' | 'ttb' | 'btt'
  size?: number | string
  showClose?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  lockScroll?: boolean
  withHeader?: boolean
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import MomoIcon from '../icon/icon.vue'
import { addUnit } from '../../utils/dom'
import { lockScroll, unlockScroll } from '../../utils/scroll-lock'

defineOptions({ name: 'MomoDrawer' })

const props = withDefaults(defineProps<DrawerProps>(), {
  modelValue: false,
  title: '',
  direction: 'rtl',
  size: 360,
  showClose: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  lockScroll: true,
  withHeader: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
  opened: []
  closed: []
}>()

const panelStyle = computed(() => {
  if (props.direction === 'rtl' || props.direction === 'ltr') {
    return { width: addUnit(props.size), height: '100%' }
  }
  return { height: addUnit(props.size), width: '100%' }
})

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

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      emit('open')
      if (props.lockScroll) lockScroll()
      document.addEventListener('keydown', handleKeydown)
    } else {
      emit('closed')
      if (props.lockScroll) unlockScroll()
      document.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (props.modelValue && props.lockScroll) unlockScroll()
})
</script>

<template>
  <Teleport to="body">
    <Transition :name="`momo-drawer-${direction}`">
      <div
        v-if="modelValue"
        class="momo-drawer"
        :class="`is-${direction}`"
      >
        <div class="momo-drawer__mask" @click="handleMaskClick" />
        <div class="momo-drawer__panel" :style="panelStyle" @click.stop>
          <div v-if="withHeader" class="momo-drawer__header">
            <slot name="header">
              <h3 class="momo-drawer__title">{{ title }}</h3>
            </slot>
            <button
              v-if="showClose"
              type="button"
              class="momo-drawer__close"
              @click="close"
            >
              <MomoIcon name="close" :size="16" />
            </button>
          </div>

          <div class="momo-drawer__body momo-scrollbar">
            <slot />
          </div>

          <div v-if="$slots.footer" class="momo-drawer__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.momo-drawer {
  position: fixed;
  inset: 0;
  z-index: var(--momo-z-dialog);

  &__mask {
    position: absolute;
    inset: 0;
    background: var(--momo-bg-mask);
    backdrop-filter: blur(3px);
  }

  &__panel {
    position: absolute;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    max-height: 100%;
    background: var(--momo-bg-card);
    box-shadow: var(--momo-shadow-lg);
  }

  &.is-rtl &__panel {
    top: 0;
    right: 0;
    border-left: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-xl) 0 0 var(--momo-radius-xl);
  }

  &.is-ltr &__panel {
    top: 0;
    left: 0;
    border-right: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: 0 var(--momo-radius-xl) var(--momo-radius-xl) 0;
  }

  &.is-ttb &__panel {
    top: 0;
    left: 0;
    border-bottom: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: 0 0 var(--momo-radius-xl) var(--momo-radius-xl);
  }

  &.is-btt &__panel {
    bottom: 0;
    left: 0;
    border-top: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-xl) var(--momo-radius-xl) 0 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 22px 12px;
    border-bottom: 1.5px dashed var(--momo-border-soft);
  }

  &__title {
    margin: 0;
    font-size: var(--momo-font-size-lg);
    font-weight: 800;
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
      transform: rotate(90deg);
    }
  }

  &__body {
    flex: 1;
    min-height: 0;
    padding: 18px 22px;
    overflow: auto;
    color: var(--momo-text-regular);
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 14px 22px 20px;
    border-top: 1.5px dashed var(--momo-border-soft);
  }
}

.momo-drawer-rtl-enter-active,
.momo-drawer-rtl-leave-active,
.momo-drawer-ltr-enter-active,
.momo-drawer-ltr-leave-active,
.momo-drawer-ttb-enter-active,
.momo-drawer-ttb-leave-active,
.momo-drawer-btt-enter-active,
.momo-drawer-btt-leave-active {
  transition: opacity 0.25s var(--momo-ease-out);

  .momo-drawer__panel {
    transition: transform 0.3s var(--momo-ease-out);
  }
}

.momo-drawer-rtl-enter-from,
.momo-drawer-rtl-leave-to,
.momo-drawer-ltr-enter-from,
.momo-drawer-ltr-leave-to,
.momo-drawer-ttb-enter-from,
.momo-drawer-ttb-leave-to,
.momo-drawer-btt-enter-from,
.momo-drawer-btt-leave-to {
  opacity: 0;
}

.momo-drawer-rtl-enter-from .momo-drawer__panel,
.momo-drawer-rtl-leave-to .momo-drawer__panel {
  transform: translateX(100%);
}

.momo-drawer-ltr-enter-from .momo-drawer__panel,
.momo-drawer-ltr-leave-to .momo-drawer__panel {
  transform: translateX(-100%);
}

.momo-drawer-ttb-enter-from .momo-drawer__panel,
.momo-drawer-ttb-leave-to .momo-drawer__panel {
  transform: translateY(-100%);
}

.momo-drawer-btt-enter-from .momo-drawer__panel,
.momo-drawer-btt-leave-to .momo-drawer__panel {
  transform: translateY(100%);
}
</style>

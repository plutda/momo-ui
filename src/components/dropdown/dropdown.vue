<script lang="ts">
export interface DropdownProps {
  trigger?: 'click' | 'hover'
  placement?: 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end'
  disabled?: boolean
  hideOnClick?: boolean
}
</script>

<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { useFloating, type Placement } from '../../hooks/useFloating'
import { useClickOutside } from '../../hooks/useClickOutside'
import { dropdownContextKey } from './context'

defineOptions({ name: 'MomoDropdown' })

const props = withDefaults(defineProps<DropdownProps>(), {
  trigger: 'click',
  placement: 'bottom-start',
  disabled: false,
  hideOnClick: true,
})

const emit = defineEmits<{
  command: [command: string | number | Record<string, any>]
  visibleChange: [visible: boolean]
}>()

const visible = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const popperRef = ref<HTMLElement | null>(null)

const { style: popperStyle } = useFloating(triggerRef, popperRef, visible, {
  placement: props.placement as Placement,
})

useClickOutside([triggerRef, popperRef], () => close())

watch(visible, (value) => emit('visibleChange', value))

function open() {
  if (props.disabled) return
  visible.value = true
}

function close() {
  visible.value = false
}

function toggle() {
  if (props.disabled) return
  visible.value = !visible.value
}

function execute(command: string | number | Record<string, any>) {
  emit('command', command)
  if (props.hideOnClick) close()
}

provide(dropdownContextKey, { visible, close, execute })
</script>

<template>
  <div
    ref="triggerRef"
    class="momo-dropdown"
    :class="{ 'is-disabled': disabled }"
    @click="trigger === 'click' && toggle()"
    @mouseenter="trigger === 'hover' && open()"
    @mouseleave="trigger === 'hover' && close()"
  >
    <slot />
  </div>

  <Teleport to="body">
    <div
      v-show="visible"
      ref="popperRef"
      class="momo-dropdown__popper"
      :style="popperStyle"
      @mouseenter="trigger === 'hover' && open()"
      @mouseleave="trigger === 'hover' && close()"
    >
      <slot name="dropdown" />
    </div>
  </Teleport>
</template>

<style lang="scss">
.momo-dropdown {
  display: inline-flex;

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__popper {
    position: fixed;
    z-index: var(--momo-z-popper);
    min-width: 160px;
    padding: 6px;
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-base);
    box-shadow: var(--momo-shadow-base);
    animation: momo-pop-in 0.2s var(--momo-ease-bounce);
  }
}
</style>

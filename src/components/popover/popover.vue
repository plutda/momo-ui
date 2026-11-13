<script lang="ts">
export interface PopoverProps {
  title?: string
  content?: string
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'bottom-start' | 'top-end' | 'bottom-end'
  trigger?: 'click' | 'hover'
  width?: number | string
  disabled?: boolean
  offset?: number
  showArrow?: boolean
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { useFloating, type Placement } from '../../hooks/useFloating'
import { useClickOutside } from '../../hooks/useClickOutside'
import { addUnit } from '../../utils/dom'

defineOptions({ name: 'MomoPopover' })

const props = withDefaults(defineProps<PopoverProps>(), {
  placement: 'bottom',
  trigger: 'click',
  width: 260,
  disabled: false,
  offset: 10,
  showArrow: true,
})

const visible = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const popperRef = ref<HTMLElement | null>(null)

const { style: popperStyle, actualPlacement } = useFloating(
  triggerRef,
  popperRef,
  visible,
  { placement: props.placement as Placement, offset: props.offset },
)

useClickOutside([triggerRef, popperRef], () => {
  if (props.trigger === 'click') hide()
})

function show() {
  if (props.disabled) return
  visible.value = true
}

function hide() {
  visible.value = false
}

function toggle() {
  if (visible.value) hide()
  else show()
}

function handleTriggerClick() {
  if (props.trigger === 'click') toggle()
}

function handleEnter() {
  if (props.trigger === 'hover') show()
}

function handleLeave() {
  if (props.trigger === 'hover') hide()
}

defineExpose({ show, hide, visible })
</script>

<template>
  <span
    ref="triggerRef"
    class="momo-popover__trigger"
    @click="handleTriggerClick"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
  >
    <slot />
  </span>

  <Teleport to="body">
    <div
      v-show="visible"
      ref="popperRef"
      class="momo-popover__popper"
      :class="`is-${actualPlacement.split('-')[0]}`"
      :style="[popperStyle, { width: addUnit(width) }]"
      @mouseenter="handleEnter"
      @mouseleave="handleLeave"
      @click.stop
    >
      <div v-if="title || $slots.title" class="momo-popover__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="momo-popover__content">
        <slot name="content">{{ content }}</slot>
      </div>
      <span v-if="showArrow" class="momo-popover__arrow" />
    </div>
  </Teleport>
</template>

<style lang="scss">
.momo-popover {
  &__trigger {
    display: inline-flex;
  }

  &__popper {
    position: fixed;
    z-index: var(--momo-z-popper);
    padding: 14px 16px;
    font-size: var(--momo-font-size-sm);
    color: var(--momo-text-regular);
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-base);
    box-shadow: var(--momo-shadow-base);
    animation: momo-pop-in 0.2s var(--momo-ease-bounce);
  }

  &__title {
    margin-bottom: 6px;
    font-size: var(--momo-font-size-base);
    font-weight: 800;
    color: var(--momo-text-primary);
  }

  &__content {
    line-height: 1.6;
  }

  &__arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    transform: rotate(45deg);
  }

  .is-top > &__arrow {
    bottom: -6px;
    left: 50%;
    border-top: none;
    border-left: none;
    transform: translateX(-50%) rotate(45deg);
  }

  .is-bottom > &__arrow {
    top: -6px;
    left: 50%;
    border-right: none;
    border-bottom: none;
    transform: translateX(-50%) rotate(45deg);
  }

  .is-left > &__arrow {
    right: -6px;
    top: 50%;
    border-bottom: none;
    border-left: none;
    transform: translateY(-50%) rotate(45deg);
  }

  .is-right > &__arrow {
    left: -6px;
    top: 50%;
    border-top: none;
    border-right: none;
    transform: translateY(-50%) rotate(45deg);
  }
}
</style>

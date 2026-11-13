<script lang="ts">
export interface TooltipProps {
  content?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click' | 'focus'
  effect?: 'dark' | 'light'
  disabled?: boolean
  offset?: number
  showArrow?: boolean
  showDelay?: number
}
</script>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useFloating } from '../../hooks/useFloating'
import { useClickOutside } from '../../hooks/useClickOutside'

defineOptions({ name: 'MomoTooltip' })

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  trigger: 'hover',
  effect: 'dark',
  disabled: false,
  offset: 8,
  showArrow: true,
  showDelay: 120,
})

const visible = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const popperRef = ref<HTMLElement | null>(null)

const { style: popperStyle, actualPlacement } = useFloating(
  triggerRef,
  popperRef,
  visible,
  { placement: props.placement, offset: props.offset },
)

useClickOutside([triggerRef, popperRef], () => {
  if (props.trigger === 'click') visible.value = false
})

let timer: number | undefined

function show() {
  if (props.disabled) return
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    visible.value = true
  }, props.showDelay)
}

function hide() {
  window.clearTimeout(timer)
  visible.value = false
}

function toggle() {
  if (visible.value) hide()
  else show()
}

function onMouseEnter() {
  if (props.trigger === 'hover') show()
}

function onMouseLeave() {
  if (props.trigger === 'hover') hide()
}

function onClick() {
  if (props.trigger === 'click') toggle()
}

function onFocus() {
  if (props.trigger === 'focus') show()
}

function onBlur() {
  if (props.trigger === 'focus') hide()
}

onBeforeUnmount(() => window.clearTimeout(timer))
</script>

<template>
  <span
    ref="triggerRef"
    class="momo-tooltip__trigger"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="onClick"
    @focusin="onFocus"
    @focusout="onBlur"
  >
    <slot />
  </span>

  <Teleport to="body">
    <div
      v-show="visible"
      ref="popperRef"
      class="momo-tooltip__popper"
      :class="[
        `is-${effect}`,
        `is-${actualPlacement.split('-')[0]}`,
      ]"
      :style="popperStyle"
      role="tooltip"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <slot name="content">{{ content }}</slot>
      <span v-if="showArrow" class="momo-tooltip__arrow" />
    </div>
  </Teleport>
</template>

<style lang="scss">
.momo-tooltip {
  &__trigger {
    display: inline-flex;
  }

  &__popper {
    position: fixed;
    z-index: var(--momo-z-popper);
    max-width: 260px;
    padding: 7px 12px;
    font-size: var(--momo-font-size-xs);
    font-weight: 600;
    line-height: 1.5;
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-sm);
    box-shadow: var(--momo-shadow-sm);
    animation: momo-pop-in 0.18s var(--momo-ease-bounce);

    &.is-dark {
      color: var(--momo-text-inverse);
      background: var(--momo-text-primary);
    }

    &.is-light {
      color: var(--momo-text-primary);
      background: var(--momo-bg-card);
    }
  }

  &__arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
    border: inherit;
    transform: rotate(45deg);
  }

  .is-top > &__arrow {
    bottom: -5px;
    left: 50%;
    border-top: none;
    border-left: none;
    transform: translateX(-50%) rotate(45deg);
  }

  .is-bottom > &__arrow {
    top: -5px;
    left: 50%;
    border-right: none;
    border-bottom: none;
    transform: translateX(-50%) rotate(45deg);
  }

  .is-left > &__arrow {
    right: -5px;
    top: 50%;
    border-bottom: none;
    border-left: none;
    transform: translateY(-50%) rotate(45deg);
  }

  .is-right > &__arrow {
    left: -5px;
    top: 50%;
    border-top: none;
    border-right: none;
    transform: translateY(-50%) rotate(45deg);
  }
}
</style>

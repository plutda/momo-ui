import { nextTick, onBeforeUnmount, reactive, ref, unref, watch, type Ref } from 'vue'

export type Placement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'

export interface FloatingOptions {
  placement?: Placement
  offset?: number
  autoFlip?: boolean
}

export function useFloating(
  triggerRef: Ref<HTMLElement | null>,
  popperRef: Ref<HTMLElement | null>,
  visible: Ref<boolean>,
  options: FloatingOptions = {},
) {
  const style = reactive({ top: '0px', left: '0px' })
  const actualPlacement = ref<Placement>(options.placement ?? 'bottom')
  const offset = options.offset ?? 8
  let listening = false

  function update() {
    const trigger = unref(triggerRef)
    const popper = unref(popperRef)
    if (!trigger || !popper) return

    const t = trigger.getBoundingClientRect()
    const p = popper.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    let placement: Placement = options.placement ?? 'bottom'

    if (options.autoFlip !== false) {
      if (
        placement.startsWith('bottom') &&
        t.bottom + offset + p.height > vh &&
        t.top - offset - p.height >= 0
      ) {
        placement = placement.replace('bottom', 'top') as Placement
      } else if (
        placement.startsWith('top') &&
        t.top - offset - p.height < 0 &&
        t.bottom + offset + p.height <= vh
      ) {
        placement = placement.replace('top', 'bottom') as Placement
      }
      if (placement === 'left' && t.left - offset - p.width < 0) placement = 'right'
      else if (placement === 'right' && t.right + offset + p.width > vw) placement = 'left'
    }

    actualPlacement.value = placement

    let top = 0
    let left = 0
    const vertical = placement.startsWith('top') || placement.startsWith('bottom')

    if (vertical) {
      top = placement.startsWith('bottom') ? t.bottom + offset : t.top - offset - p.height
      if (placement.endsWith('start')) left = t.left
      else if (placement.endsWith('end')) left = t.right - p.width
      else left = t.left + t.width / 2 - p.width / 2
    } else {
      left = placement === 'right' ? t.right + offset : t.left - offset - p.width
      top = t.top + t.height / 2 - p.height / 2
    }

    left = Math.max(8, Math.min(left, vw - p.width - 8))
    top = Math.max(8, Math.min(top, vh - p.height - 8))

    style.top = `${Math.round(top)}px`
    style.left = `${Math.round(left)}px`
  }

  function addListeners() {
    if (listening) return
    listening = true
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
  }

  function removeListeners() {
    if (!listening) return
    listening = false
    window.removeEventListener('scroll', update, true)
    window.removeEventListener('resize', update)
  }

  function start() {
    nextTick(() => {
      update()
      addListeners()
    })
  }

  watch(visible, (v) => {
    if (v) start()
    else removeListeners()
  })

  onBeforeUnmount(removeListeners)

  return { style, actualPlacement, update, start, stop: removeListeners }
}

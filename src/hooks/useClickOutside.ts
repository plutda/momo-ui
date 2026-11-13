import { onBeforeUnmount, onMounted, unref, type Ref } from 'vue'

export function useClickOutside(
  targets: Array<Ref<HTMLElement | null>>,
  handler: (event: PointerEvent) => void,
  enabled?: Ref<boolean>,
) {
  const listener = (event: PointerEvent) => {
    if (enabled && !enabled.value) return
    const target = event.target as Node | null
    if (!target) return
    const inside = targets.some((ref) => {
      const el = unref(ref)
      return !!el && el.contains(target)
    })
    if (!inside) handler(event)
  }

  onMounted(() => document.addEventListener('pointerdown', listener, true))
  onBeforeUnmount(() => document.removeEventListener('pointerdown', listener, true))
}

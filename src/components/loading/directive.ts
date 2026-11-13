import { createApp, type App, type Directive } from 'vue'
import MomoLoading from './loading.vue'

export interface LoadingDirectiveOptions {
  text?: string
  size?: number
}

type LoadingValue = boolean | LoadingDirectiveOptions | undefined

interface LoadingState {
  app: App | null
  container: HTMLElement | null
  originalPosition: string
}

const states = new WeakMap<HTMLElement, LoadingState>()

function resolveOptions(value: LoadingValue): LoadingDirectiveOptions {
  return typeof value === 'object' && value !== null ? value : {}
}

function mount(el: HTMLElement, value: LoadingValue) {
  let state = states.get(el)
  if (!state) {
    state = { app: null, container: null, originalPosition: el.style.position }
    states.set(el, state)
  }
  if (state.app) return

  if (getComputedStyle(el).position === 'static') {
    el.style.position = 'relative'
  }

  const container = document.createElement('div')
  container.className = 'momo-loading-mask'
  el.appendChild(container)

  const options = resolveOptions(value)
  const app = createApp(MomoLoading, {
    size: options.size ?? 36,
    text: options.text ?? '',
  })
  app.mount(container)

  state.app = app
  state.container = container
}

function unmount(el: HTMLElement) {
  const state = states.get(el)
  if (!state) return
  state.app?.unmount()
  state.container?.remove()
  state.app = null
  state.container = null
  el.style.position = state.originalPosition
  states.delete(el)
}

/**
 * v-loading 指令
 * <div v-loading="loading">...</div>
 * <div v-loading="{ text: '加载中', size: 48 }">...</div>
 */
export const vLoading: Directive<HTMLElement, LoadingValue> = {
  mounted(el, binding) {
    if (binding.value) mount(el, binding.value)
  },
  updated(el, binding) {
    if (binding.value) mount(el, binding.value)
    else unmount(el)
  },
  unmounted(el) {
    unmount(el)
  },
}

import { createVNode, render, type VNode } from 'vue'
import NotificationComponent, {
  type NotificationProps,
  type NotificationType,
} from './notification.vue'

export type { NotificationType }

export interface NotificationOptions extends Omit<NotificationProps, 'message'> {
  message: string
  onClose?: () => void
}

export interface NotificationHandle {
  close: () => void
}

export interface NotificationApi {
  (options: string | NotificationOptions): NotificationHandle
  success: (options: string | Omit<NotificationOptions, 'type'>) => NotificationHandle
  info: (options: string | Omit<NotificationOptions, 'type'>) => NotificationHandle
  warning: (options: string | Omit<NotificationOptions, 'type'>) => NotificationHandle
  error: (options: string | Omit<NotificationOptions, 'type'>) => NotificationHandle
  closeAll: () => void
}

let container: HTMLElement | null = null
const wrappers = new Set<HTMLElement>()

function getContainer(): HTMLElement {
  if (!container || !container.isConnected) {
    container = document.createElement('div')
    container.className = 'momo-notification-container'
    document.body.appendChild(container)
  }
  return container
}

function createNotification(options: string | NotificationOptions): NotificationHandle {
  const { onClose, ...rest } =
    typeof options === 'string'
      ? ({ message: options } as NotificationOptions)
      : options

  const wrapper = document.createElement('div')
  wrapper.className = 'momo-notification-wrapper'
  getContainer().appendChild(wrapper)
  wrappers.add(wrapper)

  const vnode: VNode = createVNode(NotificationComponent, {
    ...rest,
    onClose: () => {
      onClose?.()
      window.setTimeout(() => {
        render(null, wrapper)
        wrapper.remove()
        wrappers.delete(wrapper)
      }, 280)
    },
  })

  render(vnode, wrapper)

  return {
    close: () => {
      const exposed = vnode.component?.exposed as
        | { close?: () => void }
        | undefined
      exposed?.close?.()
    },
  }
}

function withType(type: NotificationType) {
  return (
    options: string | Omit<NotificationOptions, 'type'>,
  ): NotificationHandle =>
    createNotification(
      typeof options === 'string' ? { message: options, type } : { ...options, type },
    )
}

const notification = createNotification as NotificationApi
notification.success = withType('success')
notification.info = withType('info')
notification.warning = withType('warning')
notification.error = withType('error')
notification.closeAll = () => {
  wrappers.forEach((wrapper) => {
    render(null, wrapper)
    wrapper.remove()
  })
  wrappers.clear()
}

export const MomoNotification = notification
export default MomoNotification

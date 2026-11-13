import { createVNode, render, type VNode } from 'vue'
import MessageComponent, {
  type MessageProps,
  type MessageType,
} from './message.vue'

export type { MessageType }

export interface MessageOptions extends Omit<MessageProps, 'message'> {
  message: string
  onClose?: () => void
}

export interface MessageHandle {
  close: () => void
}

export interface MessageApi {
  (options: string | MessageOptions): MessageHandle
  success: (options: string | Omit<MessageOptions, 'type'>) => MessageHandle
  info: (options: string | Omit<MessageOptions, 'type'>) => MessageHandle
  warning: (options: string | Omit<MessageOptions, 'type'>) => MessageHandle
  error: (options: string | Omit<MessageOptions, 'type'>) => MessageHandle
  closeAll: () => void
}

let container: HTMLElement | null = null
const wrappers = new Set<HTMLElement>()

function getContainer(): HTMLElement {
  if (!container || !container.isConnected) {
    container = document.createElement('div')
    container.className = 'momo-message-container'
    document.body.appendChild(container)
  }
  return container
}

function createMessage(options: string | MessageOptions): MessageHandle {
  const { onClose, ...rest } =
    typeof options === 'string'
      ? ({ message: options } as MessageOptions)
      : options

  const wrapper = document.createElement('div')
  wrapper.className = 'momo-message-wrapper'
  getContainer().appendChild(wrapper)
  wrappers.add(wrapper)

  const vnode: VNode = createVNode(MessageComponent, {
    ...rest,
    onClose: () => {
      onClose?.()
      window.setTimeout(() => {
        render(null, wrapper)
        wrapper.remove()
        wrappers.delete(wrapper)
      }, 260)
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

function withType(type: MessageType) {
  return (options: string | Omit<MessageOptions, 'type'>): MessageHandle =>
    createMessage(
      typeof options === 'string' ? { message: options, type } : { ...options, type },
    )
}

const message = createMessage as MessageApi
message.success = withType('success')
message.info = withType('info')
message.warning = withType('warning')
message.error = withType('error')
message.closeAll = () => {
  wrappers.forEach((wrapper) => {
    render(null, wrapper)
    wrapper.remove()
  })
  wrappers.clear()
}

export const MomoMessage = message
export default MomoMessage

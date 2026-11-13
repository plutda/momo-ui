import type { InjectionKey, Ref } from 'vue'

export interface DropdownContext {
  visible: Ref<boolean>
  close: () => void
  execute: (command: string | number | Record<string, any>) => void
}

export const dropdownContextKey: InjectionKey<DropdownContext> =
  Symbol('momoDropdown')

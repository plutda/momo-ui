import type { InjectionKey, Ref } from 'vue'

export interface CollapseContext {
  activeNames: Ref<Array<string | number>>
  toggle: (name: string | number) => void
}

export const collapseContextKey: InjectionKey<CollapseContext> =
  Symbol('momoCollapse')

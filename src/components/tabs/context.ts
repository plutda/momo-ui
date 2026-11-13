import type { InjectionKey, Ref } from 'vue'

export interface TabPaneInstance {
  name: string | number
  label: string
  disabled: boolean
}

export interface TabsContext {
  activeName: Ref<string | number>
  register: (pane: TabPaneInstance) => void
  unregister: (pane: TabPaneInstance) => void
}

export const tabsContextKey: InjectionKey<TabsContext> = Symbol('momoTabs')

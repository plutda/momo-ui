import type { InjectionKey, Ref } from 'vue'

export interface MenuContext {
  activeIndex: Ref<string>
  mode: Ref<'vertical' | 'horizontal'>
  openKeys: Ref<Set<string>>
  select: (index: string) => void
  toggleSubMenu: (index: string) => void
  isOpen: (index: string) => boolean
}

export const menuContextKey: InjectionKey<MenuContext> = Symbol('momoMenu')

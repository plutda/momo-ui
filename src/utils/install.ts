import type { App, Component, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export function withInstall<T extends Component>(comp: T): SFCWithInstall<T> {
  const target = comp as SFCWithInstall<T>
  target.install = (app: App) => {
    const name = (comp as { name?: string }).name
    if (name) app.component(name, comp)
  }
  return target
}

import type { InjectionKey, Ref } from 'vue'

export interface BreadcrumbContext {
  separator: Ref<string>
}

export const breadcrumbContextKey: InjectionKey<BreadcrumbContext> =
  Symbol('momoBreadcrumb')

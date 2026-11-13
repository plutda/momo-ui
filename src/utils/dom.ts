export const isClient = () =>
  typeof window !== 'undefined' && typeof document !== 'undefined'

export function addUnit(value?: string | number, unit = 'px'): string {
  if (value === undefined || value === null || value === '') return ''
  return typeof value === 'number' ? `${value}${unit}` : value
}

export function getScrollTop(target: Window | HTMLElement = window): number {
  return target instanceof Window ? target.scrollY : target.scrollTop
}

export function scrollToTop(target: Window | HTMLElement = window) {
  const el = target instanceof Window ? target : target
  el.scrollTo({ top: 0, behavior: 'smooth' })
}

export function omitUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as T
}

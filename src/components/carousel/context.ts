import type { InjectionKey } from 'vue'

export interface CarouselContext {
  register: () => number
  unregister: (uid: number) => void
}

export const carouselContextKey: InjectionKey<CarouselContext> =
  Symbol('momoCarousel')

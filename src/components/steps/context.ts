import type { InjectionKey, Ref } from 'vue'

export interface StepsContext {
  active: Ref<number>
  direction: Ref<'horizontal' | 'vertical'>
  register: () => { index: number; uid: number }
  unregister: (uid: number) => void
}

export const stepsContextKey: InjectionKey<StepsContext> = Symbol('momoSteps')

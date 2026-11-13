import type { InjectionKey, Ref } from 'vue'

export interface RadioGroupContext {
  modelValue: Ref<any>
  disabled: Ref<boolean>
  name: Ref<string | undefined>
  change: (value: any) => void
}

export const radioGroupKey: InjectionKey<RadioGroupContext> =
  Symbol('momoRadioGroup')

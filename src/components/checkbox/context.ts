import type { InjectionKey, Ref } from 'vue'

export interface CheckboxGroupContext {
  modelValue: Ref<Array<string | number | boolean>>
  disabled: Ref<boolean>
  change: (value: string | number | boolean, checked: boolean) => void
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> =
  Symbol('momoCheckboxGroup')

import type { InjectionKey } from 'vue'
import type { FormRule, RuleTrigger } from '../../utils/validate'

export interface FormItemInstance {
  prop?: string
  validate: (trigger?: RuleTrigger) => Promise<boolean>
  resetField: () => void
  clearValidate: () => void
}

export interface FormContext {
  model: Record<string, any>
  rules?: Record<string, FormRule[]>
  labelWidth: string
  labelPosition: 'left' | 'top'
  size: 'small' | 'default' | 'large'
  disabled: boolean
  scrollToError: boolean
  registerItem: (item: FormItemInstance) => void
  unregisterItem: (item: FormItemInstance) => void
}

export const formContextKey: InjectionKey<FormContext> = Symbol('momoForm')

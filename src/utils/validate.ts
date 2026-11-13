export type RuleTrigger = 'blur' | 'change'

export interface FormRule {
  required?: boolean
  type?: 'string' | 'number' | 'array' | 'email' | 'url'
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  message?: string
  trigger?: RuleTrigger | RuleTrigger[]
  validator?: (
    value: any,
    model: Record<string, any>,
  ) => boolean | string | void | Promise<boolean | string | void>
}

export const isEmptyValue = (value: unknown): boolean => {
  if (value === undefined || value === null || value === '') return true
  return Array.isArray(value) && value.length === 0
}

export async function validateValue(
  value: any,
  rules: FormRule[],
  model: Record<string, any>,
): Promise<string | null> {
  for (const rule of rules) {
    if (rule.required && isEmptyValue(value)) {
      return rule.message || '此项为必填项'
    }
    if (isEmptyValue(value)) continue

    if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
      return rule.message || '邮箱格式不正确'
    }
    if (rule.type === 'url' && !/^https?:\/\/\S+$/.test(String(value))) {
      return rule.message || 'URL 格式不正确'
    }
    if (rule.type === 'number' && Number.isNaN(Number(value))) {
      return rule.message || '必须为数字'
    }
    if (rule.type === 'array' && !Array.isArray(value)) {
      return rule.message || '必须为数组'
    }

    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        return rule.message || `不能小于 ${rule.min}`
      }
      if (rule.max !== undefined && value > rule.max) {
        return rule.message || `不能大于 ${rule.max}`
      }
    } else if (typeof value === 'string' || Array.isArray(value)) {
      const len = value.length
      if (rule.min !== undefined && len < rule.min) {
        return rule.message || `长度不能小于 ${rule.min}`
      }
      if (rule.max !== undefined && len > rule.max) {
        return rule.message || `长度不能大于 ${rule.max}`
      }
      if (rule.len !== undefined && len !== rule.len) {
        return rule.message || `长度必须为 ${rule.len}`
      }
    }

    if (rule.pattern && !rule.pattern.test(String(value))) {
      return rule.message || '格式不正确'
    }

    if (rule.validator) {
      try {
        const result = await rule.validator(value, model)
        if (result === false) return rule.message || '校验失败'
        if (typeof result === 'string') return result
      } catch (err: any) {
        return err?.message || rule.message || '校验失败'
      }
    }
  }
  return null
}

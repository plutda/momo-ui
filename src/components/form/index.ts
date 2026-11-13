import { withInstall } from '../../utils/install'
import Form from './form.vue'
import FormItem from './form-item.vue'

export const MomoForm = withInstall(Form)
export const MomoFormItem = withInstall(FormItem)

export default { MomoForm, MomoFormItem }
export type { FormProps } from './form.vue'
export type { FormItemProps } from './form-item.vue'
export type { FormRule, RuleTrigger } from '../../utils/validate'

import { withInstall } from '../../utils/install'
import Checkbox from './checkbox.vue'
import CheckboxGroup from './checkbox-group.vue'

export const MomoCheckbox = withInstall(Checkbox)
export const MomoCheckboxGroup = withInstall(CheckboxGroup)

export default { MomoCheckbox, MomoCheckboxGroup }
export type { CheckboxProps } from './checkbox.vue'
export type { CheckboxGroupProps } from './checkbox-group.vue'

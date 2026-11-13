import { withInstall } from '../../utils/install'
import Radio from './radio.vue'
import RadioGroup from './radio-group.vue'

export const MomoRadio = withInstall(Radio)
export const MomoRadioGroup = withInstall(RadioGroup)

export default { MomoRadio, MomoRadioGroup }
export type { RadioProps } from './radio.vue'
export type { RadioGroupProps } from './radio-group.vue'

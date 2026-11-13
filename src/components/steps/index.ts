import { withInstall } from '../../utils/install'
import Steps from './steps.vue'
import Step from './step.vue'

export const MomoSteps = withInstall(Steps)
export const MomoStep = withInstall(Step)

export default { MomoSteps, MomoStep }
export type { StepsProps } from './steps.vue'
export type { StepProps } from './step.vue'

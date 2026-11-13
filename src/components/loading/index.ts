import { withInstall } from '../../utils/install'
import Loading from './loading.vue'
import { vLoading } from './directive'

export const MomoLoading = withInstall(Loading)
export const MomoLoadingDirective = vLoading
export { vLoading }
export default MomoLoading

export type { LoadingProps } from './loading.vue'
export type { LoadingDirectiveOptions } from './directive'

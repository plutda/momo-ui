import { withInstall } from '../../utils/install'
import Breadcrumb from './breadcrumb.vue'
import BreadcrumbItem from './breadcrumb-item.vue'

export const MomoBreadcrumb = withInstall(Breadcrumb)
export const MomoBreadcrumbItem = withInstall(BreadcrumbItem)

export default { MomoBreadcrumb, MomoBreadcrumbItem }
export type { BreadcrumbProps } from './breadcrumb.vue'
export type { BreadcrumbItemProps } from './breadcrumb-item.vue'

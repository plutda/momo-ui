import { withInstall } from '../../utils/install'
import Collapse from './collapse.vue'
import CollapseItem from './collapse-item.vue'

export const MomoCollapse = withInstall(Collapse)
export const MomoCollapseItem = withInstall(CollapseItem)

export default { MomoCollapse, MomoCollapseItem }
export type { CollapseProps } from './collapse.vue'
export type { CollapseItemProps } from './collapse-item.vue'

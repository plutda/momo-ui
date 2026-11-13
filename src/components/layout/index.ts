import { withInstall } from '../../utils/install'
import Row from './row.vue'
import Col from './col.vue'

export const MomoRow = withInstall(Row)
export const MomoCol = withInstall(Col)

export default { MomoRow, MomoCol }
export type { RowProps } from './row.vue'
export type { ColProps } from './col.vue'

import { withInstall } from '../../utils/install'
import Table from './table.vue'

export const MomoTable = withInstall(Table)
export default MomoTable
export type { TableProps, TableColumn, SortState } from './table.vue'

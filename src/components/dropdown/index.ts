import { withInstall } from '../../utils/install'
import Dropdown from './dropdown.vue'
import DropdownItem from './dropdown-item.vue'

export const MomoDropdown = withInstall(Dropdown)
export const MomoDropdownItem = withInstall(DropdownItem)

export default { MomoDropdown, MomoDropdownItem }
export type { DropdownProps } from './dropdown.vue'
export type { DropdownItemProps } from './dropdown-item.vue'

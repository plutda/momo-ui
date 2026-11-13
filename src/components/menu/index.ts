import { withInstall } from '../../utils/install'
import Menu from './menu.vue'
import MenuItem from './menu-item.vue'
import SubMenu from './sub-menu.vue'

export const MomoMenu = withInstall(Menu)
export const MomoMenuItem = withInstall(MenuItem)
export const MomoSubMenu = withInstall(SubMenu)

export default { MomoMenu, MomoMenuItem, MomoSubMenu }
export type { MenuProps } from './menu.vue'
export type { MenuItemProps } from './menu-item.vue'
export type { SubMenuProps } from './sub-menu.vue'

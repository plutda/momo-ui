import { withInstall } from '../../utils/install'
import Tabs from './tabs.vue'
import TabPane from './tab-pane.vue'

export const MomoTabs = withInstall(Tabs)
export const MomoTabPane = withInstall(TabPane)

export default { MomoTabs, MomoTabPane }
export type { TabsProps } from './tabs.vue'
export type { TabPaneProps } from './tab-pane.vue'

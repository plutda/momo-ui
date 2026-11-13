import { withInstall } from '../../utils/install'
import Tree from './tree.vue'

export const MomoTree = withInstall(Tree)
export default MomoTree
export type { TreeProps, TreeNode } from './tree.vue'

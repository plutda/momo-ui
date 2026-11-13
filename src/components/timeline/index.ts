import { withInstall } from '../../utils/install'
import Timeline from './timeline.vue'
import TimelineItem from './timeline-item.vue'

export const MomoTimeline = withInstall(Timeline)
export const MomoTimelineItem = withInstall(TimelineItem)

export default { MomoTimeline, MomoTimelineItem }
export type { TimelineProps } from './timeline.vue'
export type { TimelineItemProps } from './timeline-item.vue'

import type { App } from 'vue'
import './styles/index.scss'

import { MomoIcon } from './components/icon'
import { MomoButton } from './components/button'
import { MomoLink } from './components/link'
import { MomoDivider } from './components/divider'
import { MomoSpace } from './components/space'
import { MomoRow } from './components/layout'
import { MomoCol } from './components/layout'
import { MomoInput } from './components/input'
import { MomoInputNumber } from './components/input-number'
import { MomoRadio } from './components/radio'
import { MomoRadioGroup } from './components/radio'
import { MomoCheckbox } from './components/checkbox'
import { MomoCheckboxGroup } from './components/checkbox'
import { MomoSwitch } from './components/switch'
import { MomoSelect } from './components/select'
import { MomoSlider } from './components/slider'
import { MomoRate } from './components/rate'
import { MomoForm } from './components/form'
import { MomoFormItem } from './components/form'
import { MomoTable } from './components/table'
import { MomoPagination } from './components/pagination'
import { MomoTag } from './components/tag'
import { MomoBadge } from './components/badge'
import { MomoAvatar } from './components/avatar'
import { MomoCard } from './components/card'
import { MomoCollapse } from './components/collapse'
import { MomoCollapseItem } from './components/collapse'
import { MomoTabs } from './components/tabs'
import { MomoTabPane } from './components/tabs'
import { MomoTimeline } from './components/timeline'
import { MomoTimelineItem } from './components/timeline'
import { MomoTree } from './components/tree'
import { MomoCarousel } from './components/carousel'
import { MomoCarouselItem } from './components/carousel'
import { MomoDescriptions } from './components/descriptions'
import { MomoStatistic } from './components/statistic'
import { MomoEmpty } from './components/empty'
import { MomoSkeleton } from './components/skeleton'
import { MomoBreadcrumb } from './components/breadcrumb'
import { MomoBreadcrumbItem } from './components/breadcrumb'
import { MomoSteps } from './components/steps'
import { MomoStep } from './components/steps'
import { MomoDropdown } from './components/dropdown'
import { MomoDropdownItem } from './components/dropdown'
import { MomoMenu } from './components/menu'
import { MomoMenuItem } from './components/menu'
import { MomoSubMenu } from './components/menu'
import { MomoBackTop } from './components/backtop'
import { MomoAlert } from './components/alert'
import { MomoDialog } from './components/dialog'
import { MomoDrawer } from './components/drawer'
import { MomoTooltip } from './components/tooltip'
import { MomoPopover } from './components/popover'
import { MomoPopconfirm } from './components/popconfirm'
import { MomoLoading, vLoading } from './components/loading'
import { MomoProgress } from './components/progress'
import { MomoResult } from './components/result'
import { MomoDatePicker } from './components/date-picker'
import { MomoUpload } from './components/upload'
import { MomoMessage } from './components/message'
import { MomoNotification } from './components/notification'

const components = [
  MomoIcon,
  MomoButton,
  MomoLink,
  MomoDivider,
  MomoSpace,
  MomoRow,
  MomoCol,
  MomoInput,
  MomoInputNumber,
  MomoRadio,
  MomoRadioGroup,
  MomoCheckbox,
  MomoCheckboxGroup,
  MomoSwitch,
  MomoSelect,
  MomoSlider,
  MomoRate,
  MomoForm,
  MomoFormItem,
  MomoTable,
  MomoPagination,
  MomoTag,
  MomoBadge,
  MomoAvatar,
  MomoCard,
  MomoCollapse,
  MomoCollapseItem,
  MomoTabs,
  MomoTabPane,
  MomoTimeline,
  MomoTimelineItem,
  MomoTree,
  MomoCarousel,
  MomoCarouselItem,
  MomoDescriptions,
  MomoStatistic,
  MomoEmpty,
  MomoSkeleton,
  MomoBreadcrumb,
  MomoBreadcrumbItem,
  MomoSteps,
  MomoStep,
  MomoDropdown,
  MomoDropdownItem,
  MomoMenu,
  MomoMenuItem,
  MomoSubMenu,
  MomoBackTop,
  MomoAlert,
  MomoDialog,
  MomoDrawer,
  MomoTooltip,
  MomoPopover,
  MomoPopconfirm,
  MomoLoading,
  MomoProgress,
  MomoResult,
  MomoDatePicker,
  MomoUpload,
]

export const version = '0.1.0'

export function install(app: App) {
  components.forEach((component) => app.use(component))
  app.directive('loading', vLoading)
}

export {
  MomoIcon,
  MomoButton,
  MomoLink,
  MomoDivider,
  MomoSpace,
  MomoRow,
  MomoCol,
  MomoInput,
  MomoInputNumber,
  MomoRadio,
  MomoRadioGroup,
  MomoCheckbox,
  MomoCheckboxGroup,
  MomoSwitch,
  MomoSelect,
  MomoSlider,
  MomoRate,
  MomoForm,
  MomoFormItem,
  MomoTable,
  MomoPagination,
  MomoTag,
  MomoBadge,
  MomoAvatar,
  MomoCard,
  MomoCollapse,
  MomoCollapseItem,
  MomoTabs,
  MomoTabPane,
  MomoTimeline,
  MomoTimelineItem,
  MomoTree,
  MomoCarousel,
  MomoCarouselItem,
  MomoDescriptions,
  MomoStatistic,
  MomoEmpty,
  MomoSkeleton,
  MomoBreadcrumb,
  MomoBreadcrumbItem,
  MomoSteps,
  MomoStep,
  MomoDropdown,
  MomoDropdownItem,
  MomoMenu,
  MomoMenuItem,
  MomoSubMenu,
  MomoBackTop,
  MomoAlert,
  MomoDialog,
  MomoDrawer,
  MomoTooltip,
  MomoPopover,
  MomoPopconfirm,
  MomoLoading,
  MomoProgress,
  MomoResult,
  MomoDatePicker,
  MomoUpload,
  MomoMessage,
  MomoNotification,
  vLoading,
}

export { icons } from './components/icon'

export type { AlertProps } from './components/alert'
export type { AvatarProps } from './components/avatar'
export type { BackTopProps } from './components/backtop'
export type { BadgeProps } from './components/badge'
export type { BreadcrumbProps } from './components/breadcrumb'
export type { BreadcrumbItemProps } from './components/breadcrumb'
export type { ButtonProps, ButtonType, ButtonSize } from './components/button'
export type { CardProps } from './components/card'
export type { CarouselProps } from './components/carousel'
export type { CheckboxProps } from './components/checkbox'
export type { CheckboxGroupProps } from './components/checkbox'
export type { ColProps } from './components/layout'
export type { RowProps } from './components/layout'
export type { CollapseProps } from './components/collapse'
export type { CollapseItemProps } from './components/collapse'
export type { DatePickerProps } from './components/date-picker'
export type { DescriptionsProps, DescriptionItem } from './components/descriptions'
export type { DialogProps } from './components/dialog'
export type { DividerProps } from './components/divider'
export type { DrawerProps } from './components/drawer'
export type { DropdownProps } from './components/dropdown'
export type { DropdownItemProps } from './components/dropdown'
export type { EmptyProps } from './components/empty'
export type { FormProps } from './components/form'
export type { FormItemProps } from './components/form'
export type { FormRule, RuleTrigger } from './components/form'
export type { IconProps } from './components/icon'
export type { InputProps } from './components/input'
export type { InputNumberProps } from './components/input-number'
export type { LinkProps } from './components/link'
export type { LoadingProps } from './components/loading'
export type { LoadingDirectiveOptions } from './components/loading'
export type { MenuProps } from './components/menu'
export type { MenuItemProps } from './components/menu'
export type { SubMenuProps } from './components/menu'
export type {
  MessageApi,
  MessageOptions,
  MessageHandle,
  MessageType,
} from './components/message'
export type {
  NotificationApi,
  NotificationOptions,
  NotificationHandle,
  NotificationType,
} from './components/notification'
export type { PaginationProps } from './components/pagination'
export type { PopconfirmProps } from './components/popconfirm'
export type { PopoverProps } from './components/popover'
export type { ProgressProps } from './components/progress'
export type { RadioProps } from './components/radio'
export type { RadioGroupProps } from './components/radio'
export type { RateProps } from './components/rate'
export type { ResultProps } from './components/result'
export type { SelectProps, SelectOption } from './components/select'
export type { SkeletonProps } from './components/skeleton'
export type { SliderProps } from './components/slider'
export type { SpaceProps, SpaceSize } from './components/space'
export type { StatisticProps } from './components/statistic'
export type { StepsProps } from './components/steps'
export type { StepProps } from './components/steps'
export type { SwitchProps } from './components/switch'
export type { TabsProps } from './components/tabs'
export type { TabPaneProps } from './components/tabs'
export type { TagProps } from './components/tag'
export type { TimelineProps } from './components/timeline'
export type { TimelineItemProps } from './components/timeline'
export type { TooltipProps } from './components/tooltip'
export type { TableProps, TableColumn, SortState } from './components/table'
export type { TreeProps, TreeNode } from './components/tree'
export type { UploadProps, UploadFile, UploadStatus, UploadRequestOptions } from './components/upload'

const MomoUI = {
  version,
  install,
}

export default MomoUI

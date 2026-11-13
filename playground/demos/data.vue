<script setup lang="ts">
import { ref } from 'vue'
import {
  MomoCard,
  MomoCarousel,
  MomoCarouselItem,
  MomoCollapse,
  MomoCollapseItem,
  MomoCol,
  MomoDescriptions,
  MomoEmpty,
  MomoPagination,
  MomoProgress,
  MomoRow,
  MomoSkeleton,
  MomoStatistic,
  MomoTable,
  MomoTag,
  MomoTimeline,
  MomoTimelineItem,
  MomoTree,
  type DescriptionItem,
  type TableColumn,
  type TreeNode,
} from '../../src'

interface ServerRow {
  id: number
  name: string
  owner: string
  qps: number
  status: 'running' | 'warning' | 'stopped'
}

const columns: TableColumn[] = [
  { type: 'selection', width: 46 },
  { prop: 'name', label: '服务名', slot: 'name', minWidth: 180 },
  { prop: 'owner', label: '负责人', width: 110 },
  { prop: 'qps', label: 'QPS', width: 110, align: 'right', sortable: true },
  { prop: 'status', label: '状态', width: 120, slot: 'status' },
]

const tableData: ServerRow[] = [
  { id: 1, name: 'momo-gateway', owner: '小熊', qps: 1280, status: 'running' },
  { id: 2, name: 'momo-auth', owner: '小兔', qps: 860, status: 'running' },
  { id: 3, name: 'momo-order', owner: '小猫', qps: 2140, status: 'warning' },
  { id: 4, name: 'momo-pay', owner: '小鹿', qps: 990, status: 'running' },
  { id: 5, name: 'momo-notify', owner: '小狐', qps: 120, status: 'stopped' },
]

function statusMeta(status: ServerRow['status']) {
  const map = {
    running: { text: '运行中', type: 'success' as const },
    warning: { text: '告警', type: 'warning' as const },
    stopped: { text: '已停止', type: 'danger' as const },
  }
  return map[status]
}

const page = ref(1)
const pageSize = ref(10)

const descItems: DescriptionItem[] = [
  { label: '应用名称', value: 'momo-gateway' },
  { label: '负责人', value: '小熊' },
  { label: '所属集群', value: 'prod-shanghai-01' },
  { label: '实例数', value: 12 },
  { label: '版本', value: 'v2.4.1' },
  { label: '创建时间', value: '2026-08-18' },
]

const treeData: TreeNode[] = [
  {
    key: 'prod',
    label: '生产环境',
    children: [
      { key: 'prod-gateway', label: 'momo-gateway' },
      { key: 'prod-auth', label: 'momo-auth' },
      {
        key: 'prod-order',
        label: 'momo-order',
        children: [
          { key: 'prod-order-api', label: 'order-api' },
          { key: 'prod-order-worker', label: 'order-worker' },
        ],
      },
    ],
  },
  {
    key: 'test',
    label: '测试环境',
    children: [
      { key: 'test-gateway', label: 'momo-gateway-test' },
      { key: 'test-auth', label: 'momo-auth-test' },
    ],
  },
]

const activePanels = ref<string[]>(['1'])
</script>

<template>
  <div>
    <section class="demo-section">
      <h2 class="demo-section__title">表格 Table</h2>

      <MomoTable
        :data="tableData"
        :columns="columns"
        border
        striped
        height="320"
        row-key="id"
      >
        <template #name="{ row }">
          <span style="font-weight: 800; color: var(--momo-color-primary-dark)">
            {{ row.name }}
          </span>
        </template>
        <template #status="{ row }">
          <MomoTag :type="statusMeta(row.status).type" size="small">
            {{ statusMeta(row.status).text }}
          </MomoTag>
        </template>
      </MomoTable>

      <div class="demo-row" style="margin-top: 16px; justify-content: center">
        <MomoPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total="86"
        />
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">统计数值 Statistic</h2>
      <MomoRow :gutter="14">
        <MomoCol :span="8">
          <MomoStatistic title="在线实例" :value="1286" suffix="个" />
        </MomoCol>
        <MomoCol :span="8">
          <MomoStatistic title="今日告警" :value="23" prefix="⚠" />
        </MomoCol>
        <MomoCol :span="8">
          <MomoStatistic title="可用率" :value="99.98" :precision="2" suffix="%" />
        </MomoCol>
      </MomoRow>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">进度条 Progress</h2>

      <div class="demo-block">
        <MomoProgress :percentage="68" />
        <MomoProgress :percentage="86" status="success" striped striped-flow />
        <MomoProgress :percentage="42" status="warning" text-inside />
      </div>

      <div class="demo-flex" style="margin-top: 16px">
        <MomoProgress type="circle" :percentage="75" />
        <MomoProgress type="circle" :percentage="100" status="success" />
        <MomoProgress type="circle" :percentage="32" status="error" />
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">描述列表 Descriptions</h2>
      <MomoDescriptions
        title="应用详情"
        :items="descItems"
        :column="3"
        border
      />
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">时间线 Timeline</h2>
      <MomoTimeline>
        <MomoTimelineItem timestamp="2026-11-11 09:20" color="var(--momo-color-success)">
          发布 momo-gateway v2.4.1 完成
        </MomoTimelineItem>
        <MomoTimelineItem timestamp="2026-11-11 10:05" color="var(--momo-color-warning)">
          检测到 order 服务 QPS 异常
        </MomoTimelineItem>
        <MomoTimelineItem timestamp="2026-11-11 10:12" color="var(--momo-color-danger)">
          触发告警并自动扩容 2 个实例
        </MomoTimelineItem>
        <MomoTimelineItem timestamp="2026-11-11 10:30" hollow>
          服务恢复正常
        </MomoTimelineItem>
      </MomoTimeline>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">树形控件 Tree</h2>
      <div class="demo-panel">
        <MomoTree
          :data="treeData"
          checkable
          :default-checked-keys="['prod-gateway']"
        />
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">折叠面板 Collapse</h2>
      <MomoCollapse v-model="activePanels">
        <MomoCollapseItem name="1" title="什么是 Momo UI？">
          Momo UI 是一套卡通风格的 Vue 3 基础组件库，强调粗描边、糖果色和果冻动效。
        </MomoCollapseItem>
        <MomoCollapseItem name="2" title="支持哪些组件？">
          覆盖基础、表单、数据展示、导航、反馈、高级六大类，共 60+ 组件。
        </MomoCollapseItem>
        <MomoCollapseItem name="3" title="可以自定义主题吗？">
          可以，所有颜色、圆角、阴影都通过 CSS 变量暴露，覆盖 :root 即可换肤。
        </MomoCollapseItem>
      </MomoCollapse>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">轮播 Carousel</h2>
      <MomoCarousel height="200" :autoplay="false" arrow="always">
        <MomoCarouselItem>
          <div class="demo-slide demo-slide--1">🍭 第一屏 · 糖果色</div>
        </MomoCarouselItem>
        <MomoCarouselItem>
          <div class="demo-slide demo-slide--2">🧸 第二屏 · 棕熊</div>
        </MomoCarouselItem>
        <MomoCarouselItem>
          <div class="demo-slide demo-slide--3">🌈 第三屏 · 彩虹</div>
        </MomoCarouselItem>
      </MomoCarousel>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">骨架屏 Skeleton</h2>
      <MomoCard>
        <MomoSkeleton :rows="3" avatar animated />
      </MomoCard>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">空状态 Empty</h2>
      <MomoEmpty description="暂无数据，喝口奶茶休息一下～" />
    </section>
  </div>
</template>

<style scoped>
.demo-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 20px;
  font-weight: 900;
  color: #fff;
  text-shadow: 1px 2px 0 rgba(45, 42, 62, 0.35);
}

.demo-slide--1 {
  background: linear-gradient(135deg, #7c5cff, #a78bfa);
}

.demo-slide--2 {
  background: linear-gradient(135deg, #ffb020, #ff7b54);
}

.demo-slide--3 {
  background: linear-gradient(135deg, #2ed573, #54a0ff);
}
</style>

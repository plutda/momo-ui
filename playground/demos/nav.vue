<script setup lang="ts">
import { ref } from 'vue'
import {
  MomoBackTop,
  MomoBreadcrumb,
  MomoBreadcrumbItem,
  MomoButton,
  MomoCard,
  MomoDivider,
  MomoDropdown,
  MomoDropdownItem,
  MomoMenu,
  MomoMenuItem,
  MomoMessage,
  MomoStep,
  MomoSteps,
  MomoSubMenu,
  MomoTabPane,
  MomoTabs,
} from '../../src'

const activeStep = ref(1)
const activeTab = ref('overview')
const cardTab = ref('a')
const activeMenu = ref('overview')

function handleCommand(command: string | number | Record<string, any>) {
  MomoMessage.info(`点击了菜单项：${String(command)}`)
}

function handleMenuSelect(index: string) {
  activeMenu.value = index
  MomoMessage.success(`当前菜单：${index}`)
}
</script>

<template>
  <div>
    <section class="demo-section">
      <h2 class="demo-section__title">面包屑 Breadcrumb</h2>
      <MomoBreadcrumb separator="›">
        <MomoBreadcrumbItem href="#">首页</MomoBreadcrumbItem>
        <MomoBreadcrumbItem href="#">资源中心</MomoBreadcrumbItem>
        <MomoBreadcrumbItem>应用详情</MomoBreadcrumbItem>
      </MomoBreadcrumb>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">步骤条 Steps</h2>

      <MomoSteps :active="activeStep">
        <MomoStep title="填写信息" description="配置基础参数" />
        <MomoStep title="校验配置" description="检查是否合法" />
        <MomoStep title="发布上线" description="推送到生产环境" />
        <MomoStep title="完成" description="等待生效" />
      </MomoSteps>

      <div class="demo-row" style="margin-top: 18px">
        <MomoButton :disabled="activeStep === 0" @click="activeStep--">
          上一步
        </MomoButton>
        <MomoButton type="primary" :disabled="activeStep >= 3" @click="activeStep++">
          下一步
        </MomoButton>
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">标签页 Tabs</h2>

      <MomoTabs v-model="activeTab">
        <MomoTabPane name="overview" label="概览">
          <div class="demo-panel">这里是概览内容，展示核心指标和健康状态。</div>
        </MomoTabPane>
        <MomoTabPane name="config" label="配置">
          <div class="demo-panel">这里是配置内容，可以调整副本数与资源规格。</div>
        </MomoTabPane>
        <MomoTabPane name="logs" label="日志">
          <div class="demo-panel">这里是日志内容，支持检索与下载。</div>
        </MomoTabPane>
        <MomoTabPane name="disabled" label="禁用页" disabled>
          <div class="demo-panel">不可见</div>
        </MomoTabPane>
      </MomoTabs>

      <MomoDivider />

      <MomoTabs v-model="cardTab" type="card">
        <MomoTabPane name="a" label="卡片式">
          <div class="demo-panel">卡片式标签页。</div>
        </MomoTabPane>
        <MomoTabPane name="b" label="第二个">
          <div class="demo-panel">第二个卡片页。</div>
        </MomoTabPane>
      </MomoTabs>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">下拉菜单 Dropdown</h2>
      <div class="demo-row">
        <MomoDropdown @command="handleCommand">
          <MomoButton type="primary" icon="more">更多操作</MomoButton>
          <template #dropdown>
            <MomoDropdownItem command="edit" icon="edit">编辑</MomoDropdownItem>
            <MomoDropdownItem command="copy" icon="file">复制</MomoDropdownItem>
            <MomoDropdownItem command="delete" icon="trash" divided>
              删除
            </MomoDropdownItem>
          </template>
        </MomoDropdown>

        <MomoDropdown trigger="hover" placement="bottom-start">
          <MomoButton>悬停展开</MomoButton>
          <template #dropdown>
            <MomoDropdownItem command="a">选项 A</MomoDropdownItem>
            <MomoDropdownItem command="b">选项 B</MomoDropdownItem>
            <MomoDropdownItem command="c" disabled>选项 C（禁用）</MomoDropdownItem>
          </template>
        </MomoDropdown>
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">导航菜单 Menu</h2>
      <div class="demo-flex">
        <MomoMenu
          default-active="overview"
          style="width: 210px"
          @select="handleMenuSelect"
        >
          <MomoMenuItem index="overview" icon="home">总览</MomoMenuItem>
          <MomoSubMenu index="resource" title="资源管理" icon="folder">
            <MomoMenuItem index="apps">应用列表</MomoMenuItem>
            <MomoMenuItem index="clusters">集群列表</MomoMenuItem>
            <MomoMenuItem index="hosts">主机列表</MomoMenuItem>
          </MomoSubMenu>
          <MomoMenuItem index="monitor" icon="eye">监控中心</MomoMenuItem>
          <MomoMenuItem index="setting" icon="setting">系统设置</MomoMenuItem>
        </MomoMenu>

        <MomoMenu
          default-active="1"
          mode="horizontal"
          style="flex: 1; min-width: 0"
          @select="handleMenuSelect"
        >
          <MomoMenuItem index="1">工作台</MomoMenuItem>
          <MomoMenuItem index="2">任务</MomoMenuItem>
          <MomoMenuItem index="3">报表</MomoMenuItem>
        </MomoMenu>
      </div>
    </section>

    <section class="demo-section" style="height: 260px">
      <h2 class="demo-section__title">回到顶部 BackTop</h2>
      <MomoCard>
        <p style="margin: 0; font-weight: 600; color: var(--momo-text-regular)">
          向下滚动页面，右下角会出现一个圆滚滚的回到顶部按钮。
        </p>
      </MomoCard>
      <MomoBackTop :visibility-height="200" />
    </section>
  </div>
</template>

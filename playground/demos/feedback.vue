<script setup lang="ts">
import { ref } from 'vue'
import {
  MomoAlert,
  MomoButton,
  MomoDialog,
  MomoDrawer,
  MomoLoading,
  MomoMessage,
  MomoNotification,
  MomoPopconfirm,
  MomoPopover,
  MomoResult,
  MomoTooltip,
  vLoading,
} from '../../src'

const dialogVisible = ref(false)
const drawerVisible = ref(false)
const dialogLoading = ref(false)
const loadingBox = ref(true)

function confirmDialog() {
  dialogLoading.value = true
  window.setTimeout(() => {
    dialogLoading.value = false
    dialogVisible.value = false
    MomoMessage.success('保存成功')
  }, 800)
}

function handleConfirm() {
  MomoMessage.success('已确认删除')
}

function handleCancel() {
  MomoMessage.info('已取消操作')
}

function toggleBox() {
  loadingBox.value = !loadingBox.value
}
</script>

<template>
  <div>
    <section class="demo-section">
      <h2 class="demo-section__title">警告提示 Alert</h2>
      <div class="demo-block">
        <MomoAlert
          type="success"
          title="发布成功"
          description="momo-gateway v2.4.1 已经部署到生产环境。"
          closable
        />
        <MomoAlert
          type="info"
          title="小提示"
          description="所有颜色变量都可以通过 CSS 变量覆盖。"
        />
        <MomoAlert
          type="warning"
          title="注意"
          description="当前实例数低于推荐值，建议扩容。"
          closable
        />
        <MomoAlert
          type="error"
          title="操作失败"
          description="连接超时，请检查网络后重试。"
        />
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">全局消息 Message</h2>
      <div class="demo-row">
        <MomoButton type="success" @click="MomoMessage.success('操作成功，已同步到所有实例')">
          成功消息
        </MomoButton>
        <MomoButton @click="MomoMessage.info('这是一条普通提示')">
          普通消息
        </MomoButton>
        <MomoButton type="warning" @click="MomoMessage.warning('磁盘空间不足 15%')">
          警告消息
        </MomoButton>
        <MomoButton type="danger" @click="MomoMessage.error('请求失败，请稍后重试')">
          错误消息
        </MomoButton>
        <MomoButton
          plain
          @click="MomoMessage({ message: '可关闭的消息', closable: true, duration: 0 })"
        >
          不自动关闭
        </MomoButton>
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">通知 Notification</h2>
      <div class="demo-row">
        <MomoButton
          type="success"
          @click="
            MomoNotification.success({
              title: '部署完成',
              message: 'momo-order 已成功发布到 prod-shanghai-01。',
            })
          "
        >
          成功通知
        </MomoButton>
        <MomoButton
          type="warning"
          @click="
            MomoNotification.warning({
              title: '容量告警',
              message: '当前集群 CPU 使用率已达 82%，请关注。',
            })
          "
        >
          告警通知
        </MomoButton>
        <MomoButton
          @click="
            MomoNotification.info({
              title: '系统消息',
              message: '今晚 23:00 将进行例行巡检。',
            })
          "
        >
          信息通知
        </MomoButton>
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">对话框 Dialog</h2>
      <div class="demo-row">
        <MomoButton type="primary" @click="dialogVisible = true">
          打开对话框
        </MomoButton>

        <MomoButton @click="drawerVisible = true">打开抽屉</MomoButton>
      </div>

      <MomoDialog
        v-model="dialogVisible"
        title="编辑应用信息"
        :draggable="true"
        width="520px"
      >
        <p style="margin: 0; line-height: 1.8">
          这是一个可拖拽的对话框。按住标题栏就可以把它拖来拖去，关闭时会播放果冻缩放动画。
        </p>
        <template #footer>
          <MomoButton @click="dialogVisible = false">取消</MomoButton>
          <MomoButton type="primary" :loading="dialogLoading" @click="confirmDialog">
            保存
          </MomoButton>
        </template>
      </MomoDialog>

      <MomoDrawer v-model="drawerVisible" title="应用详情" size="380px">
        <div class="demo-block">
          <span class="demo-label">应用名称</span>
          <span>momo-gateway</span>
        </div>
        <div class="demo-block">
          <span class="demo-label">负责人</span>
          <span>小熊</span>
        </div>
        <div class="demo-block">
          <span class="demo-label">实例数</span>
          <span>12 个</span>
        </div>
        <template #footer>
          <MomoButton @click="drawerVisible = false">关闭</MomoButton>
          <MomoButton type="primary" @click="drawerVisible = false">确定</MomoButton>
        </template>
      </MomoDrawer>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">气泡提示 Tooltip / Popover / Popconfirm</h2>
      <div class="demo-row">
        <MomoTooltip content="这是一个轻量提示" placement="top">
          <MomoButton>悬停提示</MomoButton>
        </MomoTooltip>

        <MomoTooltip content="浅色气泡" effect="light" placement="bottom">
          <MomoButton>浅色提示</MomoButton>
        </MomoTooltip>

        <MomoPopover
          title="Momo 气泡卡片"
          content="气泡里可以放更丰富的内容，比如说明文字、链接或者小表单。"
          placement="bottom"
        >
          <MomoButton type="primary">点击弹出 Popover</MomoButton>
        </MomoPopover>

        <MomoPopconfirm
          title="确定要删除这条记录吗？"
          content="删除后将无法恢复，请谨慎操作。"
          confirm-button-type="danger"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        >
          <MomoButton type="danger" plain>删除记录</MomoButton>
        </MomoPopconfirm>
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">加载中 Loading</h2>
      <div class="demo-flex">
        <div class="demo-panel" style="display: flex; align-items: center; justify-content: center; width: 220px; height: 150px">
          <MomoLoading text="加载中…" />
        </div>

        <div
          v-loading="loadingBox"
          class="demo-panel"
          style="display: flex; align-items: center; justify-content: center; width: 300px; height: 150px"
        >
          <div style="text-align: center">
            <div style="font-weight: 800">v-loading 指令</div>
            <MomoButton size="small" style="margin-top: 8px" @click="toggleBox">
              {{ loadingBox ? '关闭加载' : '开启加载' }}
            </MomoButton>
          </div>
        </div>
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">结果页 Result</h2>
      <MomoResult
        status="success"
        title="发布成功"
        sub-title="momo-gateway v2.4.1 已经部署到 12 个实例，全部健康。"
      >
        <template #extra>
          <MomoButton type="primary">查看详情</MomoButton>
          <MomoButton>返回列表</MomoButton>
        </template>
      </MomoResult>
    </section>
  </div>
</template>

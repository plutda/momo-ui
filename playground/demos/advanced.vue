<script setup lang="ts">
import { ref } from 'vue'
import {
  MomoAlert,
  MomoButton,
  MomoDatePicker,
  MomoMessage,
  MomoUpload,
  type UploadFile,
  type UploadRequestOptions,
} from '../../src'

const date = ref('2026-11-11')
const range = ref<[string, string]>(['2026-11-01', '2026-11-11'])

const minDate = '2026-01-01'
const maxDate = '2026-12-31'

function beforeUpload(file: File) {
  const smallerThan2M = file.size / 1024 / 1024 < 2
  if (!smallerThan2M) {
    MomoMessage.error('文件大小不能超过 2MB')
  }
  return smallerThan2M
}

async function customUpload(options: UploadRequestOptions) {
  for (let percent = 0; percent <= 100; percent += 20) {
    await new Promise((resolve) => window.setTimeout(resolve, 120))
    options.onProgress(percent)
  }
  return { url: `https://example.com/files/${options.file.name}` }
}

function handleSuccess(file: UploadFile) {
  MomoMessage.success(`${file.name} 上传成功`)
}

function handleExceed() {
  MomoMessage.warning('最多只能上传 3 个文件')
}
</script>

<template>
  <div>
    <section class="demo-section">
      <h2 class="demo-section__title">日期选择 DatePicker</h2>

      <div class="demo-flex">
        <div class="demo-block demo-narrow">
          <span class="demo-label">单日选择</span>
          <MomoDatePicker v-model="date" />
        </div>

        <div class="demo-block" style="min-width: 300px">
          <span class="demo-label">日期范围</span>
          <MomoDatePicker v-model="range" type="daterange" />
        </div>

        <div class="demo-block demo-narrow">
          <span class="demo-label">限制范围（2026 年）</span>
          <MomoDatePicker v-model="date" :min-date="minDate" :max-date="maxDate" />
        </div>

        <div class="demo-block demo-narrow">
          <span class="demo-label">禁用状态</span>
          <MomoDatePicker v-model="date" disabled />
        </div>
      </div>

      <MomoAlert
        type="info"
        title="v-model 为字符串"
        description="单日返回 YYYY-MM-DD；日期范围返回 [开始日期, 结束日期] 元组。"
      />
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">上传 Upload（拖拽 + 自动模拟上传）</h2>

      <div class="demo-block">
        <MomoUpload
          drag
          multiple
          :limit="3"
          accept=".png,.jpg,.jpeg,.pdf"
          tip="支持 png / jpg / pdf，单个文件不超过 2MB，最多 3 个"
          :before-upload="beforeUpload"
          @exceed="handleExceed"
          @success="handleSuccess"
        />
      </div>

      <MomoAlert
        type="warning"
        title="演示模式"
        description="未配置 action 或 httpRequest 时会使用内置的模拟上传，仅用于展示进度和成功状态。"
      />
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">上传 Upload（自定义 httpRequest + 图片列表）</h2>

      <MomoUpload
        list-type="picture"
        accept="image/*"
        multiple
        :http-request="customUpload"
        tip="图片会显示缩略图，使用自定义上传逻辑"
        @success="handleSuccess"
      />

      <div class="demo-row" style="margin-top: 20px">
        <MomoButton type="primary" @click="MomoMessage.success('自定义上传演示完成')">
          触发提示
        </MomoButton>
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">组合示例</h2>
      <div class="demo-panel">
        <p style="margin: 0 0 14px; font-weight: 700; color: var(--momo-text-regular)">
          选择日期范围，再拖拽上传一个文件，Momo UI 的交互会保持一致的卡通手感。
        </p>
        <MomoDatePicker v-model="range" type="daterange" />
      </div>
    </section>
  </div>
</template>

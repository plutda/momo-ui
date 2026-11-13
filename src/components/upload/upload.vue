<script lang="ts">
export type UploadStatus = 'ready' | 'uploading' | 'success' | 'error'

export interface UploadFile {
  uid: number
  name: string
  size: number
  status: UploadStatus
  percent: number
  raw?: File
  url?: string
  response?: unknown
}

export interface UploadRequestOptions {
  file: File
  filename: string
  action?: string
  headers?: Record<string, string>
  data?: Record<string, string>
  onProgress: (percent: number) => void
}

export interface UploadProps {
  action?: string
  headers?: Record<string, string>
  data?: Record<string, string>
  name?: string
  multiple?: boolean
  accept?: string
  disabled?: boolean
  drag?: boolean
  limit?: number
  autoUpload?: boolean
  showFileList?: boolean
  listType?: 'text' | 'picture'
  buttonText?: string
  tip?: string
  httpRequest?: (options: UploadRequestOptions) => Promise<unknown>
  beforeUpload?: (file: File) => boolean | Promise<boolean>
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MomoIcon from '../icon/icon.vue'
import MomoButton from '../button/button.vue'

defineOptions({ name: 'MomoUpload' })

const props = withDefaults(defineProps<UploadProps>(), {
  action: '',
  headers: () => ({}),
  data: () => ({}),
  name: 'file',
  multiple: false,
  accept: '',
  disabled: false,
  drag: false,
  limit: 0,
  autoUpload: true,
  showFileList: true,
  listType: 'text',
  buttonText: '点击上传',
  tip: '',
  httpRequest: undefined,
  beforeUpload: undefined,
})

const emit = defineEmits<{
  change: [file: UploadFile, files: UploadFile[]]
  success: [file: UploadFile, response: unknown]
  error: [error: unknown, file: UploadFile]
  remove: [file: UploadFile]
  exceed: [files: File[]]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const fileList = ref<UploadFile[]>([])
const dragOver = ref(false)

const uploading = computed(() =>
  fileList.value.some((file) => file.status === 'uploading'),
)

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function openFileDialog() {
  if (props.disabled) return
  inputRef.value?.click()
}

function simulateUpload(item: UploadFile): Promise<void> {
  return new Promise((resolve) => {
    let percent = 0
    const timer = window.setInterval(() => {
      percent = Math.min(100, percent + 20)
      item.percent = percent
      if (percent >= 100) {
        window.clearInterval(timer)
        resolve()
      }
    }, 120)
  })
}

function xhrUpload(item: UploadFile): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', props.action)
    Object.entries(props.headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        item.percent = Math.round((event.loaded / event.total) * 100)
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response)
      else reject(new Error(`上传失败（${xhr.status}）`))
    }
    xhr.onerror = () => reject(new Error('网络错误，上传失败'))

    const formData = new FormData()
    if (item.raw) formData.append(props.name, item.raw, item.name)
    Object.entries(props.data).forEach(([key, value]) => {
      formData.append(key, value)
    })
    xhr.send(formData)
  })
}

async function doUpload(item: UploadFile) {
  if (!item.raw || item.status === 'uploading') return
  item.status = 'uploading'
  item.percent = 0

  try {
    let response: unknown = undefined
    if (props.httpRequest) {
      response = await props.httpRequest({
        file: item.raw,
        filename: props.name,
        action: props.action,
        headers: props.headers,
        data: props.data,
        onProgress: (percent) => {
          item.percent = percent
        },
      })
    } else if (props.action) {
      response = await xhrUpload(item)
    } else {
      await simulateUpload(item)
    }

    item.status = 'success'
    item.percent = 100
    item.response = response
    emit('success', item, response)
    emit('change', item, fileList.value)
  } catch (error) {
    item.status = 'error'
    emit('error', error, item)
    emit('change', item, fileList.value)
  }
}

async function addFiles(files: File[]) {
  for (const raw of files) {
    if (props.limit && fileList.value.length >= props.limit) {
      emit('exceed', files)
      break
    }

    if (props.beforeUpload) {
      const allowed = await props.beforeUpload(raw)
      if (allowed === false) continue
    }

    const item: UploadFile = {
      uid: Date.now() + Math.random(),
      name: raw.name,
      size: raw.size,
      status: 'ready',
      percent: 0,
      raw,
      url: raw.type.startsWith('image/') ? URL.createObjectURL(raw) : undefined,
    }

    fileList.value.push(item)
    const target = fileList.value[fileList.value.length - 1]
    emit('change', target, fileList.value)

    if (props.autoUpload) {
      doUpload(target)
    }
  }
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  target.value = ''
  addFiles(files)
}

function handleDrop(event: DragEvent) {
  dragOver.value = false
  if (props.disabled) return
  addFiles(Array.from(event.dataTransfer?.files ?? []))
}

function removeFile(item: UploadFile) {
  if (props.disabled) return
  const index = fileList.value.findIndex((file) => file.uid === item.uid)
  if (index > -1) fileList.value.splice(index, 1)
  if (item.url?.startsWith('blob:')) URL.revokeObjectURL(item.url)
  emit('remove', item)
  emit('change', item, fileList.value)
}

function submit() {
  if (props.disabled) return
  fileList.value
    .filter((file) => file.status === 'ready')
    .forEach((file) => doUpload(file))
}

function clearFiles() {
  fileList.value = []
}

defineExpose({ submit, clearFiles, fileList })
</script>

<template>
  <div class="momo-upload" :class="{ 'is-disabled': disabled }">
    <div
      v-if="drag"
      class="momo-upload__dragger"
      :class="{ 'is-over': dragOver }"
      @click="openFileDialog"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="handleDrop"
    >
      <MomoIcon name="upload" :size="30" class="momo-upload__drag-icon" />
      <div class="momo-upload__drag-text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
      <div v-if="tip || $slots.tip" class="momo-upload__tip">
        <slot name="tip">{{ tip }}</slot>
      </div>
    </div>

    <div v-else class="momo-upload__trigger">
      <slot>
        <MomoButton :disabled="disabled" :loading="uploading" @click="openFileDialog">
          {{ buttonText }}
        </MomoButton>
      </slot>
      <div v-if="tip || $slots.tip" class="momo-upload__tip">
        <slot name="tip">{{ tip }}</slot>
      </div>
    </div>

    <input
      ref="inputRef"
      class="momo-upload__input"
      type="file"
      :multiple="multiple"
      :accept="accept"
      @change="handleInputChange"
    />

    <ul
      v-if="showFileList && fileList.length"
      class="momo-upload__list"
      :class="`momo-upload__list--${listType}`"
    >
      <li v-for="file in fileList" :key="file.uid" class="momo-upload__item">
        <img
          v-if="listType === 'picture' && file.url"
          :src="file.url"
          class="momo-upload__thumb"
          alt=""
        />
        <MomoIcon
          v-else
          :name="file.status === 'success' ? 'file' : 'file'"
          :size="20"
          class="momo-upload__file-icon"
        />

        <div class="momo-upload__info">
          <div class="momo-upload__name" :title="file.name">{{ file.name }}</div>
          <div v-if="file.status === 'uploading'" class="momo-upload__bar">
            <div class="momo-upload__bar-inner" :style="{ width: `${file.percent}%` }" />
          </div>
          <div v-else class="momo-upload__meta">
            {{ formatSize(file.size) }}
            <span v-if="file.status === 'error'" class="momo-upload__error">上传失败</span>
          </div>
        </div>

        <MomoIcon
          v-if="file.status === 'success'"
          name="success"
          :size="17"
          class="momo-upload__status is-success"
        />
        <MomoIcon
          v-else-if="file.status === 'uploading'"
          name="loading"
          :size="17"
          class="momo-upload__status is-loading"
          spin
        />
        <button
          v-else-if="file.status === 'error'"
          type="button"
          class="momo-upload__retry"
          @click="doUpload(file)"
        >
          重试
        </button>

        <button
          type="button"
          class="momo-upload__remove"
          :disabled="disabled"
          @click="removeFile(file)"
        >
          <MomoIcon name="trash" :size="15" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.momo-upload {
  &__input {
    display: none;
  }

  &__trigger {
    display: inline-flex;
    flex-direction: column;
    gap: 6px;
  }

  &__dragger {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 26px 20px;
    text-align: center;
    cursor: pointer;
    background: var(--momo-bg-soft);
    border: 2px dashed var(--momo-border-color);
    border-radius: var(--momo-radius-lg);
    transition: var(--momo-transition);

    &:hover,
    &.is-over {
      background: var(--momo-color-primary-soft);
      border-color: var(--momo-color-primary);
      box-shadow: var(--momo-shadow-sm);
    }
  }

  &__drag-icon {
    color: var(--momo-color-primary);
  }

  &__drag-text {
    font-size: var(--momo-font-size-sm);
    font-weight: 600;
    color: var(--momo-text-regular);

    em {
      font-style: normal;
      font-weight: 800;
      color: var(--momo-color-primary);
    }
  }

  &__tip {
    font-size: var(--momo-font-size-xs);
    color: var(--momo-text-placeholder);
  }

  &__list {
    margin: 12px 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    background: var(--momo-bg-card);
    border: 1.5px solid var(--momo-border-soft);
    border-radius: var(--momo-radius-base);
    transition: var(--momo-transition);

    &:hover {
      border-color: var(--momo-border-color);
      box-shadow: var(--momo-shadow-xs);
    }
  }

  &__thumb {
    flex: none;
    width: 38px;
    height: 38px;
    object-fit: cover;
    border: 1.5px solid var(--momo-border-soft);
    border-radius: 9px;
  }

  &__file-icon {
    flex: none;
    color: var(--momo-color-primary);
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: var(--momo-font-size-sm);
    font-weight: 600;
    color: var(--momo-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    font-size: var(--momo-font-size-xs);
    color: var(--momo-text-placeholder);
  }

  &__error {
    margin-left: 6px;
    font-weight: 700;
    color: var(--momo-color-danger);
  }

  &__bar {
    height: 5px;
    margin-top: 5px;
    overflow: hidden;
    background: var(--momo-bg-soft);
    border-radius: 99px;
  }

  &__bar-inner {
    height: 100%;
    background: var(--momo-color-primary);
    border-radius: 99px;
    transition: width 0.16s linear;
  }

  &__status {
    flex: none;

    &.is-success {
      color: var(--momo-color-success);
    }

    &.is-loading {
      color: var(--momo-color-primary);
      animation: momo-spin 0.9s linear infinite;
    }
  }

  &__retry {
    flex: none;
    padding: 2px 8px;
    font-size: var(--momo-font-size-xs);
    font-weight: 700;
    color: var(--momo-color-danger);
    cursor: pointer;
    background: var(--momo-color-danger-soft);
    border: 1.5px solid var(--momo-color-danger);
    border-radius: 99px;
  }

  &__remove {
    flex: none;
    display: inline-flex;
    padding: 4px;
    color: var(--momo-text-placeholder);
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: 8px;
    transition: var(--momo-transition);

    &:hover:not(:disabled) {
      color: var(--momo-color-danger);
      background: var(--momo-color-danger-soft);
    }

    &:disabled {
      cursor: not-allowed;
    }
  }
}
</style>

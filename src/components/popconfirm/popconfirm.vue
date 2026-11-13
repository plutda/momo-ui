<script lang="ts">
export interface PopconfirmProps {
  title?: string
  content?: string
  confirmText?: string
  cancelText?: string
  confirmButtonType?: 'primary' | 'danger' | 'success' | 'warning'
  placement?: 'top' | 'bottom' | 'left' | 'right'
  width?: number
  disabled?: boolean
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
import MomoPopover from '../popover/popover.vue'
import MomoButton from '../button/button.vue'
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoPopconfirm' })

const props = withDefaults(defineProps<PopconfirmProps>(), {
  title: '确认执行该操作吗？',
  confirmText: '确定',
  cancelText: '取消',
  confirmButtonType: 'primary',
  placement: 'top',
  width: 240,
  disabled: false,
})

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const popoverRef = ref<InstanceType<typeof MomoPopover> | null>(null)

function confirm() {
  emit('confirm')
  popoverRef.value?.hide()
}

function cancel() {
  emit('cancel')
  popoverRef.value?.hide()
}
</script>

<template>
  <MomoPopover
    ref="popoverRef"
    :placement="placement"
    :width="width"
    :disabled="disabled"
    trigger="click"
  >
    <template #content>
      <div class="momo-popconfirm">
        <div class="momo-popconfirm__main">
          <MomoIcon name="warning" :size="20" class="momo-popconfirm__icon" />
          <div class="momo-popconfirm__text">
            <div class="momo-popconfirm__title">{{ title }}</div>
            <div v-if="content || $slots.content" class="momo-popconfirm__desc">
              <slot name="content">{{ content }}</slot>
            </div>
          </div>
        </div>
        <div class="momo-popconfirm__actions">
          <MomoButton size="small" @click="cancel">{{ cancelText }}</MomoButton>
          <MomoButton size="small" :type="confirmButtonType" @click="confirm">
            {{ confirmText }}
          </MomoButton>
        </div>
      </div>
    </template>
    <slot />
  </MomoPopover>
</template>

<style lang="scss">
.momo-popconfirm {
  &__main {
    display: flex;
    gap: 10px;
  }

  &__icon {
    flex: none;
    margin-top: 1px;
    color: var(--momo-color-warning);
  }

  &__title {
    font-size: var(--momo-font-size-sm);
    font-weight: 700;
    color: var(--momo-text-primary);
  }

  &__desc {
    margin-top: 4px;
    font-size: var(--momo-font-size-xs);
    color: var(--momo-text-secondary);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 14px;
  }
}
</style>

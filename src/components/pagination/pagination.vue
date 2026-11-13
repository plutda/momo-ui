<script lang="ts">
export interface PaginationProps {
  page?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
  showTotal?: boolean
  showSizes?: boolean
  showJumper?: boolean
  size?: 'small' | 'default'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoPagination' })

const props = withDefaults(defineProps<PaginationProps>(), {
  page: 1,
  pageSize: 10,
  total: 0,
  pageSizes: () => [10, 15, 30, 60, 100],
  showTotal: true,
  showSizes: true,
  showJumper: false,
  size: 'default',
})

const emit = defineEmits<{
  'update:page': [page: number]
  'update:pageSize': [size: number]
  change: [page: number, pageSize: number]
  sizeChange: [size: number]
}>()

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.pageSize)),
)

const pagers = computed<Array<number | string>>(() => {
  const total = totalPages.value
  const current = props.page
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const result: Array<number | string> = [1]
  if (current > 4) result.push('prev-more')
  const start = Math.max(2, current - 2)
  const end = Math.min(total - 1, current + 2)
  for (let i = start; i <= end; i += 1) result.push(i)
  if (current < total - 3) result.push('next-more')
  result.push(total)
  return result
})

function go(page: number) {
  const next = Math.min(Math.max(1, page), totalPages.value)
  if (next === props.page) return
  emit('update:page', next)
  emit('change', next, props.pageSize)
}

function handlePager(item: number | string) {
  if (typeof item === 'number') go(item)
  else if (item === 'prev-more') go(props.page - 3)
  else go(props.page + 3)
}

function handleSizeChange(event: Event) {
  const size = Number((event.target as HTMLSelectElement).value)
  emit('update:pageSize', size)
  emit('sizeChange', size)
  emit('update:page', 1)
  emit('change', 1, size)
}

function handleJumper(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  if (!Number.isNaN(value)) go(value)
}
</script>

<template>
  <div class="momo-pagination" :class="`momo-pagination--${size}`">
    <span v-if="showTotal" class="momo-pagination__total">
      共 {{ total }} 条
    </span>

    <button
      class="momo-pagination__btn is-prev"
      :disabled="page <= 1"
      @click="go(page - 1)"
    >
      <MomoIcon name="chevron-left" :size="14" />
    </button>

    <button
      v-for="item in pagers"
      :key="String(item)"
      class="momo-pagination__btn"
      :class="{
        'is-active': item === page,
        'is-more': typeof item === 'string',
      }"
      @click="handlePager(item)"
    >
      {{ typeof item === 'string' ? '…' : item }}
    </button>

    <button
      class="momo-pagination__btn is-next"
      :disabled="page >= totalPages"
      @click="go(page + 1)"
    >
      <MomoIcon name="chevron-right" :size="14" />
    </button>

    <select
      v-if="showSizes"
      class="momo-pagination__sizes"
      :value="pageSize"
      @change="handleSizeChange"
    >
      <option v-for="size in pageSizes" :key="size" :value="size">
        {{ size }} 条/页
      </option>
    </select>

    <label v-if="showJumper" class="momo-pagination__jumper">
      前往
      <input class="momo-pagination__jumper-input" type="number" min="1" :max="totalPages" @keydown.enter="handleJumper" />
      页
    </label>
  </div>
</template>

<style lang="scss">
.momo-pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: var(--momo-font-size-sm);
  color: var(--momo-text-regular);

  &__total {
    margin-right: 6px;
    font-weight: 700;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 34px;
    height: 34px;
    padding: 0 8px;
    font-family: inherit;
    font-size: var(--momo-font-size-sm);
    font-weight: 700;
    color: var(--momo-text-primary);
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-sm);
    box-shadow: var(--momo-shadow-xs);
    cursor: pointer;
    transition: var(--momo-transition);

    &:hover:not(:disabled) {
      transform: translate(-1px, -1px);
      box-shadow: var(--momo-shadow-sm);
      border-color: var(--momo-color-primary);
      color: var(--momo-color-primary);
    }

    &:active:not(:disabled) {
      transform: translate(1px, 1px);
      box-shadow: none;
    }

    &.is-active {
      color: var(--momo-text-inverse);
      background: var(--momo-color-primary);
      border-color: var(--momo-color-primary-dark);
      box-shadow: var(--momo-shadow-sm);
    }

    &.is-more {
      border-color: transparent;
      background: transparent;
      box-shadow: none;
      cursor: default;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.4;
      box-shadow: none;
    }
  }

  &__sizes {
    height: 34px;
    padding: 0 10px;
    font-family: inherit;
    font-size: var(--momo-font-size-sm);
    font-weight: 700;
    color: var(--momo-text-primary);
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-sm);
    box-shadow: var(--momo-shadow-xs);
    outline: none;
    cursor: pointer;
  }

  &__jumper {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  &__jumper-input {
    width: 54px;
    height: 34px;
    padding: 0 8px;
    font-family: inherit;
    font-size: var(--momo-font-size-sm);
    text-align: center;
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-sm);
    outline: none;

    &:focus {
      border-color: var(--momo-color-primary);
    }
  }

  &--small {
    .momo-pagination__btn,
    .momo-pagination__sizes,
    .momo-pagination__jumper-input {
      height: 28px;
      min-width: 28px;
      font-size: var(--momo-font-size-xs);
    }
  }
}
</style>

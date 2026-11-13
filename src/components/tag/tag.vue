<script lang="ts">
export interface TagProps {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'small' | 'default' | 'large'
  effect?: 'light' | 'dark' | 'plain'
  round?: boolean
  closable?: boolean
  hit?: boolean
  color?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoTag' })

const props = withDefaults(defineProps<TagProps>(), {
  type: 'primary',
  size: 'default',
  effect: 'light',
  round: false,
  closable: false,
  hit: false,
})

const emit = defineEmits<{
  close: [event: MouseEvent]
  click: [event: MouseEvent]
}>()

const tagClass = computed(() => [
  `momo-tag--${props.type}`,
  `momo-tag--${props.size}`,
  `momo-tag--${props.effect}`,
  {
    'is-round': props.round,
    'is-hit': props.hit,
  },
])

const customStyle = computed(() =>
  props.color
    ? props.effect === 'dark'
      ? { background: props.color, borderColor: props.color, color: '#fff' }
      : { color: props.color, borderColor: props.color, background: 'transparent' }
    : undefined,
)

function handleClose(event: MouseEvent) {
  event.stopPropagation()
  emit('close', event)
}
</script>

<template>
  <span class="momo-tag" :class="tagClass" :style="customStyle" @click="emit('click', $event)">
    <slot />
    <MomoIcon
      v-if="closable"
      name="close"
      :size="12"
      class="momo-tag__close"
      @click="handleClose"
    />
  </span>
</template>

<style lang="scss">
.momo-tag {
  --momo-tag-bg: var(--momo-color-primary-soft);
  --momo-tag-color: var(--momo-color-primary-dark);
  --momo-tag-border: var(--momo-color-primary-light);

  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 26px;
  padding: 0 10px;
  font-size: var(--momo-font-size-xs);
  font-weight: 700;
  line-height: 1;
  color: var(--momo-tag-color);
  white-space: nowrap;
  background: var(--momo-tag-bg);
  border: 1.5px solid var(--momo-tag-border);
  border-radius: var(--momo-radius-xs);
  transition: var(--momo-transition);

  &.is-round {
    border-radius: var(--momo-radius-round);
  }

  &.is-hit {
    cursor: pointer;

    &:hover {
      transform: translateY(-1px) rotate(-1deg);
      box-shadow: var(--momo-shadow-xs);
    }
  }

  &__close {
    cursor: pointer;
    opacity: 0.7;
    transition: 0.14s;

    &:hover {
      opacity: 1;
      transform: scale(1.2) rotate(90deg);
    }
  }

  &--default {
    --momo-tag-bg: var(--momo-bg-soft);
    --momo-tag-color: var(--momo-text-regular);
    --momo-tag-border: var(--momo-border-soft);
  }

  &--success {
    --momo-tag-bg: var(--momo-color-success-soft);
    --momo-tag-color: #15944d;
    --momo-tag-border: var(--momo-color-success);
  }

  &--warning {
    --momo-tag-bg: var(--momo-color-warning-soft);
    --momo-tag-color: #b87300;
    --momo-tag-border: var(--momo-color-warning);
  }

  &--danger {
    --momo-tag-bg: var(--momo-color-danger-soft);
    --momo-tag-color: var(--momo-color-danger);
    --momo-tag-border: var(--momo-color-danger);
  }

  &--info {
    --momo-tag-bg: var(--momo-color-info-soft);
    --momo-tag-color: #2b7de0;
    --momo-tag-border: var(--momo-color-info);
  }

  &--dark {
    --momo-tag-bg: var(--momo-color-primary);
    --momo-tag-color: var(--momo-text-inverse);
    --momo-tag-border: var(--momo-color-primary-dark);

    &.momo-tag--success {
      --momo-tag-bg: var(--momo-color-success);
      --momo-tag-color: var(--momo-text-inverse);
    }

    &.momo-tag--warning {
      --momo-tag-bg: var(--momo-color-warning);
      --momo-tag-color: var(--momo-text-inverse);
    }

    &.momo-tag--danger {
      --momo-tag-bg: var(--momo-color-danger);
      --momo-tag-color: var(--momo-text-inverse);
    }

    &.momo-tag--info {
      --momo-tag-bg: var(--momo-color-info);
      --momo-tag-color: var(--momo-text-inverse);
    }

    &.momo-tag--default {
      --momo-tag-bg: var(--momo-text-regular);
      --momo-tag-color: var(--momo-text-inverse);
    }
  }

  &--plain {
    --momo-tag-bg: transparent;
  }

  &--small {
    height: 22px;
    padding: 0 7px;
    font-size: 11px;
  }

  &--large {
    height: 32px;
    padding: 0 14px;
    font-size: var(--momo-font-size-sm);
    border-radius: var(--momo-radius-sm);
  }
}
</style>

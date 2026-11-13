<script lang="ts">
export interface RateProps {
  modelValue?: number
  max?: number
  disabled?: boolean
  size?: number
  showText?: boolean
  texts?: string[]
  colors?: string[]
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoRate' })

const props = withDefaults(defineProps<RateProps>(), {
  modelValue: 0,
  max: 5,
  disabled: false,
  size: 24,
  showText: false,
  texts: () => ['极差', '失望', '一般', '满意', '超赞'],
  colors: () => ['#ffb020'],
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

const hoverValue = ref(0)

const displayValue = computed(() => hoverValue.value || props.modelValue)

const currentText = computed(() => {
  const value = Math.ceil(displayValue.value)
  if (!value) return ''
  return props.texts[value - 1] ?? ''
})

const activeColor = computed(() => {
  const value = Math.ceil(displayValue.value)
  return props.colors[Math.max(0, value - 1)] ?? props.colors[0]
})

function select(value: number) {
  if (props.disabled) return
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="momo-rate" :class="{ 'is-disabled': disabled }" @mouseleave="hoverValue = 0">
    <span
      v-for="index in max"
      :key="index"
      class="momo-rate__item"
      :class="{ 'is-active': index <= displayValue }"
      :style="{ color: index <= displayValue ? activeColor : undefined }"
      @click="select(index)"
      @mouseenter="hoverValue = disabled ? 0 : index"
    >
      <MomoIcon name="star" :size="size" :stroke-width="1.8" />
    </span>
    <span v-if="showText && currentText" class="momo-rate__text">
      {{ currentText }}
    </span>
  </div>
</template>

<style lang="scss">
.momo-rate {
  display: inline-flex;
  align-items: center;
  gap: 2px;

  &__item {
    display: inline-flex;
    color: var(--momo-text-placeholder);
    cursor: pointer;
    transition: transform 0.18s var(--momo-ease-bounce), color 0.16s;

    &:hover {
      transform: scale(1.18) rotate(-6deg);
    }

    &.is-active :deep(svg),
    &.is-active svg {
      fill: currentColor;
    }
  }

  &__text {
    margin-left: 10px;
    font-size: var(--momo-font-size-sm);
    font-weight: 700;
    color: var(--momo-color-warning);
  }

  &.is-disabled {
    opacity: 0.6;

    .momo-rate__item {
      cursor: not-allowed;

      &:hover {
        transform: none;
      }
    }
  }
}
</style>

<script lang="ts">
export interface TimelineItemProps {
  timestamp?: string
  color?: string
  hollow?: boolean
  icon?: string
  size?: 'normal' | 'large'
}
</script>

<script setup lang="ts">
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoTimelineItem' })

const props = withDefaults(defineProps<TimelineItemProps>(), {
  color: 'var(--momo-color-primary)',
  hollow: false,
  size: 'normal',
})
</script>

<template>
  <li class="momo-timeline-item" :class="`momo-timeline-item--${size}`">
    <span
      class="momo-timeline-item__dot"
      :class="{ 'is-hollow': hollow }"
      :style="{
        borderColor: color,
        background: hollow ? 'var(--momo-bg-card)' : color,
      }"
    >
      <MomoIcon v-if="icon" :name="icon" :size="12" />
    </span>
    <div class="momo-timeline-item__tail" :style="{ background: color }" />
    <div class="momo-timeline-item__content">
      <div v-if="timestamp" class="momo-timeline-item__timestamp">
        {{ timestamp }}
      </div>
      <div class="momo-timeline-item__body">
        <slot />
      </div>
    </div>
  </li>
</template>

<style lang="scss">
.momo-timeline-item {
  position: relative;
  display: flex;
  gap: 14px;
  padding-bottom: 22px;

  &:last-child {
    padding-bottom: 0;

    .momo-timeline-item__tail {
      display: none;
    }
  }

  &__dot {
    position: relative;
    z-index: 1;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    margin-top: 4px;
    color: var(--momo-text-inverse);
    border: 2.5px solid var(--momo-color-primary);
    border-radius: 50%;
    box-shadow: 0 0 0 3px var(--momo-bg-card);

    &.is-hollow {
      border-width: 2.5px;
    }
  }

  &__tail {
    position: absolute;
    top: 18px;
    left: 6px;
    bottom: 0;
    width: 2px;
    opacity: 0.35;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__timestamp {
    margin-bottom: 3px;
    font-size: var(--momo-font-size-xs);
    font-weight: 700;
    color: var(--momo-text-placeholder);
  }

  &__body {
    font-size: var(--momo-font-size-sm);
    color: var(--momo-text-regular);
  }

  &--large &__dot {
    width: 20px;
    height: 20px;
  }

  &--large &__tail {
    left: 9px;
  }
}
</style>

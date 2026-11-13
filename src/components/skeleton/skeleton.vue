<script lang="ts">
export interface SkeletonProps {
  loading?: boolean
  rows?: number
  animated?: boolean
  avatar?: boolean
  title?: boolean
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'MomoSkeleton' })

const props = withDefaults(defineProps<SkeletonProps>(), {
  loading: true,
  rows: 3,
  animated: true,
  avatar: false,
  title: true,
})

const widths = computed(() =>
  Array.from({ length: props.rows }, (_, index) => {
    const presets = [100, 92, 96, 86, 90]
    return `${presets[index % presets.length]}%`
  }),
)
</script>

<template>
  <div v-if="loading" class="momo-skeleton" :class="{ 'is-animated': animated }">
    <div v-if="avatar" class="momo-skeleton__avatar" />
    <div class="momo-skeleton__content">
      <div v-if="title" class="momo-skeleton__title" />
      <div
        v-for="(width, index) in widths"
        :key="index"
        class="momo-skeleton__row"
        :style="{ width }"
      />
    </div>
  </div>
  <slot v-else />
</template>

<style lang="scss">
.momo-skeleton {
  display: flex;
  gap: 14px;
  width: 100%;

  &__avatar {
    flex: none;
    width: 48px;
    height: 48px;
    background: var(--momo-bg-soft);
    border-radius: 50%;
  }

  &__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 12px;
    padding-top: 4px;
  }

  &__title {
    width: 46%;
    height: 18px;
    background: var(--momo-bg-soft);
    border-radius: var(--momo-radius-sm);
  }

  &__row {
    height: 13px;
    background: var(--momo-bg-soft);
    border-radius: var(--momo-radius-sm);
  }

  &__title,
  &__row,
  &__avatar {
    overflow: hidden;
    position: relative;
  }

  &.is-animated &__title,
  &.is-animated &__row,
  &.is-animated &__avatar {
    background: linear-gradient(
      90deg,
      var(--momo-bg-soft) 25%,
      var(--momo-bg-hover) 50%,
      var(--momo-bg-soft) 75%
    );
    background-size: 200% 100%;
    animation: momo-skeleton-shimmer 1.4s ease-in-out infinite;
  }
}

@keyframes momo-skeleton-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>

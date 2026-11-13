<script lang="ts">
export interface EmptyProps {
  description?: string
  image?: string
  imageSize?: number
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'MomoEmpty' })

const props = withDefaults(defineProps<EmptyProps>(), {
  description: '空空如也～',
  imageSize: 120,
})

const imageStyle = computed(() => ({
  width: `${props.imageSize}px`,
  height: `${props.imageSize * 0.78}px`,
}))
</script>

<template>
  <div class="momo-empty">
    <slot name="image">
      <img
        v-if="image"
        class="momo-empty__image"
        :src="image"
        :style="imageStyle"
        alt="empty"
      />
      <svg
        v-else
        class="momo-empty__image"
        :style="imageStyle"
        viewBox="0 0 120 94"
        fill="none"
      >
        <path
          d="M31 68c-13 0-23-9-23-21S17 26 30 26c3-10 12-17 23-17 13 0 24 9 26 21 12 1 21 10 21 22 0 12-10 21-22 21H31Z"
          fill="var(--momo-color-primary-soft)"
          stroke="var(--momo-border-color)"
          stroke-width="3"
          stroke-linejoin="round"
        />
        <circle cx="47" cy="50" r="3.2" fill="var(--momo-border-color)" />
        <circle cx="75" cy="50" r="3.2" fill="var(--momo-border-color)" />
        <path
          d="M52 61c4.5 4.5 12.5 4.5 17 0"
          stroke="var(--momo-border-color)"
          stroke-width="3"
          stroke-linecap="round"
        />
        <path
          d="M22 78h76"
          stroke="var(--momo-border-color)"
          stroke-width="3"
          stroke-linecap="round"
          stroke-dasharray="6 7"
          opacity="0.45"
        />
      </svg>
    </slot>
    <p class="momo-empty__description">
      <slot name="description">{{ description }}</slot>
    </p>
    <div v-if="$slots.default" class="momo-empty__extra">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.momo-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;

  &__image {
    animation: momo-bounce 3.2s ease-in-out infinite;
  }

  &__description {
    margin: 14px 0 0;
    font-size: var(--momo-font-size-sm);
    font-weight: 700;
    color: var(--momo-text-secondary);
  }

  &__extra {
    margin-top: 14px;
  }
}
</style>

<script lang="ts">
export interface TimelineProps {
  reverse?: boolean
}
</script>

<script setup lang="ts">
defineOptions({ name: 'MomoTimeline' })

withDefaults(defineProps<TimelineProps>(), { reverse: false })
</script>

<template>
  <ul class="momo-timeline" :class="{ 'is-reverse': reverse }">
    <slot />
  </ul>
</template>

<style lang="scss">
.momo-timeline {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  list-style: none;

  &.is-reverse {
    flex-direction: column-reverse;
  }
}
</style>

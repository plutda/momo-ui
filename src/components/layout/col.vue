<script lang="ts">
export interface ColProps {
  span?: number
  offset?: number
}
</script>

<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'

defineOptions({ name: 'MomoCol' })

const props = withDefaults(defineProps<ColProps>(), {
  span: 24,
})

const gutter = inject<Ref<number>>('momoRowGutter', ref(0))

const colStyle = computed(() => ({
  paddingLeft: `${gutter.value / 2}px`,
  paddingRight: `${gutter.value / 2}px`,
  marginLeft: props.offset ? `${(props.offset / 24) * 100}%` : undefined,
  flex: `0 0 ${(props.span / 24) * 100}%`,
  maxWidth: `${(props.span / 24) * 100}%`,
}))
</script>

<template>
  <div class="momo-col" :style="colStyle">
    <slot />
  </div>
</template>

<style lang="scss">
.momo-col {
  position: relative;
  min-height: 1px;
}
</style>

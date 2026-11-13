<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted } from 'vue'
import { carouselContextKey } from './context'

defineOptions({ name: 'MomoCarouselItem' })

const carousel = inject(carouselContextKey, null)
let uid = 0

onMounted(() => {
  uid = carousel?.register() ?? 0
})

onBeforeUnmount(() => {
  if (uid) carousel?.unregister(uid)
})
</script>

<template>
  <div class="momo-carousel-item">
    <slot />
  </div>
</template>

<style lang="scss">
.momo-carousel-item {
  display: flex;
  flex: 0 0 100%;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

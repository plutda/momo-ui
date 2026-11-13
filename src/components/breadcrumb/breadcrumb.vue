<script lang="ts">
export interface BreadcrumbProps {
  separator?: string
}
</script>

<script setup lang="ts">
import { provide, toRef } from 'vue'
import { breadcrumbContextKey } from './context'

defineOptions({ name: 'MomoBreadcrumb' })

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  separator: '/',
})

provide(breadcrumbContextKey, { separator: toRef(props, 'separator') })
</script>

<template>
  <nav class="momo-breadcrumb" aria-label="breadcrumb">
    <slot />
  </nav>
</template>

<style lang="scss">
.momo-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  font-size: var(--momo-font-size-sm);
}
</style>

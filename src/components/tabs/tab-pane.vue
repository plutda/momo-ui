<script lang="ts">
export interface TabPaneProps {
  name: string | number
  label: string
  disabled?: boolean
}
</script>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted } from 'vue'
import { tabsContextKey } from './context'

defineOptions({ name: 'MomoTabPane' })

const props = withDefaults(defineProps<TabPaneProps>(), {
  disabled: false,
})

const tabs = inject(tabsContextKey, null)

const instance = {
  name: props.name,
  label: props.label,
  disabled: props.disabled,
}

const isActive = computed(() => tabs?.activeName.value === props.name)

onMounted(() => tabs?.register(instance))
onBeforeUnmount(() => tabs?.unregister(instance))
</script>

<template>
  <div v-show="isActive" class="momo-tab-pane" role="tabpanel">
    <slot />
  </div>
</template>

<style lang="scss">
.momo-tab-pane {
  animation: momo-fade-in 0.2s var(--momo-ease-out);
}
</style>

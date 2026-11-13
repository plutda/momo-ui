<script lang="ts">
export interface MenuProps {
  defaultActive?: string
  mode?: 'vertical' | 'horizontal'
  defaultOpeneds?: string[]
}
</script>

<script setup lang="ts">
import { provide, ref, toRef } from 'vue'
import { menuContextKey } from './context'

defineOptions({ name: 'MomoMenu' })

const props = withDefaults(defineProps<MenuProps>(), {
  defaultActive: '',
  mode: 'vertical',
  defaultOpeneds: () => [],
})

const emit = defineEmits<{
  select: [index: string]
  open: [index: string]
  close: [index: string]
}>()

const activeIndex = ref(props.defaultActive)
const openKeys = ref<Set<string>>(new Set(props.defaultOpeneds))

function select(index: string) {
  activeIndex.value = index
  emit('select', index)
}

function toggleSubMenu(index: string) {
  const next = new Set(openKeys.value)
  if (next.has(index)) {
    next.delete(index)
    emit('close', index)
  } else {
    next.add(index)
    emit('open', index)
  }
  openKeys.value = next
}

function isOpen(index: string) {
  return openKeys.value.has(index)
}

provide(menuContextKey, {
  activeIndex,
  mode: toRef(props, 'mode'),
  openKeys,
  select,
  toggleSubMenu,
  isOpen,
})
</script>

<template>
  <ul class="momo-menu" :class="`momo-menu--${mode}`">
    <slot />
  </ul>
</template>

<style lang="scss">
.momo-menu {
  display: flex;
  gap: 4px;
  padding: 6px;
  margin: 0;
  list-style: none;
  background: var(--momo-bg-card);
  border: var(--momo-border-width) solid var(--momo-border-color);
  border-radius: var(--momo-radius-lg);
  box-shadow: var(--momo-shadow-base);

  &--vertical {
    flex-direction: column;
  }

  &--horizontal {
    flex-direction: row;
    align-items: center;
  }
}
</style>

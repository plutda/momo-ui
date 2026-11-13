<script lang="ts">
export interface CollapseProps {
  modelValue?: Array<string | number> | string | number
  accordion?: boolean
  bordered?: boolean
}
</script>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { collapseContextKey } from './context'

defineOptions({ name: 'MomoCollapse' })

const props = withDefaults(defineProps<CollapseProps>(), {
  modelValue: () => [],
  accordion: false,
  bordered: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: Array<string | number> | string | number]
  change: [value: Array<string | number> | string | number]
}>()

const activeNames = computed<Array<string | number>>(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue
  if (props.modelValue === undefined || props.modelValue === null) return []
  return [props.modelValue]
})

function toggle(name: string | number) {
  if (props.accordion) {
    const next = activeNames.value.includes(name) ? undefined : name
    emit('update:modelValue', next ?? '')
    emit('change', next ?? '')
    return
  }
  const next = activeNames.value.includes(name)
    ? activeNames.value.filter((item) => item !== name)
    : [...activeNames.value, name]
  emit('update:modelValue', next)
  emit('change', next)
}

provide(collapseContextKey, { activeNames, toggle })
</script>

<template>
  <div class="momo-collapse" :class="{ 'is-bordered': bordered }">
    <slot />
  </div>
</template>

<style lang="scss">
.momo-collapse {
  overflow: hidden;
  background: var(--momo-bg-card);
  border-radius: var(--momo-radius-lg);

  &.is-bordered {
    border: var(--momo-border-width) solid var(--momo-border-color);
    box-shadow: var(--momo-shadow-base);
  }
}
</style>

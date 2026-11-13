<script lang="ts">
export interface StepsProps {
  active?: number
  direction?: 'horizontal' | 'vertical'
  finishStatus?: 'finish' | 'success'
  processStatus?: 'process' | 'error'
}
</script>

<script setup lang="ts">
import { provide, ref, toRef } from 'vue'
import { stepsContextKey } from './context'

defineOptions({ name: 'MomoSteps' })

const props = withDefaults(defineProps<StepsProps>(), {
  active: 0,
  direction: 'horizontal',
  finishStatus: 'finish',
  processStatus: 'process',
})

const emit = defineEmits<{ change: [index: number] }>()

const items = ref<Array<{ uid: number }>>([])
let seed = 0

function register() {
  seed += 1
  const uid = seed
  items.value = [...items.value, { uid }]
  return { index: items.value.length - 1, uid }
}

function unregister(uid: number) {
  items.value = items.value.filter((item) => item.uid !== uid)
}

provide(stepsContextKey, {
  active: toRef(props, 'active'),
  direction: toRef(props, 'direction'),
  register,
  unregister,
})

defineExpose({ emit })
</script>

<template>
  <div class="momo-steps" :class="`momo-steps--${direction}`">
    <slot />
  </div>
</template>

<style lang="scss">
.momo-steps {
  display: flex;
  width: 100%;

  &--horizontal {
    flex-direction: row;
    gap: 0;
  }

  &--vertical {
    flex-direction: column;
    gap: 0;
  }
}
</style>

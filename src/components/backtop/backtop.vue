<script lang="ts">
export interface BackTopProps {
  visibilityHeight?: number
  right?: number | string
  bottom?: number | string
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import MomoIcon from '../icon/icon.vue'
import { addUnit } from '../../utils/dom'

defineOptions({ name: 'MomoBackTop' })

const props = withDefaults(defineProps<BackTopProps>(), {
  visibilityHeight: 240,
  right: 36,
  bottom: 36,
})

const visible = ref(false)

function handleScroll() {
  visible.value = window.scrollY > props.visibilityHeight
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const buttonStyle = computed(() => ({
  right: addUnit(props.right),
  bottom: addUnit(props.bottom),
}))

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <Teleport to="body">
    <Transition name="momo-backtop">
      <button
        v-show="visible"
        type="button"
        class="momo-backtop"
        :style="buttonStyle"
        aria-label="回到顶部"
        @click="scrollToTop"
      >
        <MomoIcon name="arrow-up" :size="20" />
      </button>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.momo-backtop {
  position: fixed;
  z-index: 2000;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  color: var(--momo-text-inverse);
  background: var(--momo-color-primary);
  border: var(--momo-border-width) solid var(--momo-border-color);
  border-radius: 50%;
  box-shadow: var(--momo-shadow-base);
  cursor: pointer;
  outline: none;
  transition: var(--momo-transition);

  &:hover {
    transform: translate(-2px, -4px) rotate(-6deg);
    box-shadow: var(--momo-shadow-lg);
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: var(--momo-shadow-xs);
  }
}

.momo-backtop-enter-active {
  animation: momo-pop-in 0.3s var(--momo-ease-bounce);
}

.momo-backtop-leave-active {
  transition: opacity 0.16s, transform 0.16s;
}

.momo-backtop-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>

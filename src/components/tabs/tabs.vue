<script lang="ts">
export interface TabsProps {
  modelValue?: string | number
  type?: 'line' | 'card' | 'segment'
  stretch?: boolean
}
</script>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { tabsContextKey, type TabPaneInstance } from './context'

defineOptions({ name: 'MomoTabs' })

const props = withDefaults(defineProps<TabsProps>(), {
  modelValue: '',
  type: 'line',
  stretch: false,
})

const emit = defineEmits<{
  'update:modelValue': [name: string | number]
  change: [name: string | number]
  tabClick: [pane: TabPaneInstance]
}>()

const panes = ref<TabPaneInstance[]>([])

const activeName = computed(() => props.modelValue)

function register(pane: TabPaneInstance) {
  if (!panes.value.some((item) => item.name === pane.name)) {
    panes.value = [...panes.value, pane]
  }
}

function unregister(pane: TabPaneInstance) {
  panes.value = panes.value.filter((item) => item !== pane)
}

function select(pane: TabPaneInstance) {
  if (pane.disabled) return
  emit('tabClick', pane)
  if (pane.name === props.modelValue) return
  emit('update:modelValue', pane.name)
  emit('change', pane.name)
}

provide(tabsContextKey, { activeName, register, unregister })
</script>

<template>
  <div class="momo-tabs" :class="[`momo-tabs--${type}`, { 'is-stretch': stretch }]">
    <div class="momo-tabs__nav momo-scrollbar">
      <span
        v-for="pane in panes"
        :key="String(pane.name)"
        class="momo-tabs__tab"
        :class="{
          'is-active': pane.name === activeName,
          'is-disabled': pane.disabled,
        }"
        @click="select(pane)"
      >
        {{ pane.label }}
      </span>
    </div>
    <div class="momo-tabs__content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.momo-tabs {
  display: flex;
  flex-direction: column;
  width: 100%;

  &__nav {
    display: flex;
    gap: 6px;
    overflow-x: auto;
  }

  &.is-stretch &__nav {
    .momo-tabs__tab {
      flex: 1;
      text-align: center;
    }
  }

  &__tab {
    position: relative;
    flex: none;
    padding: 9px 16px;
    font-size: var(--momo-font-size-base);
    font-weight: 700;
    color: var(--momo-text-secondary);
    white-space: nowrap;
    cursor: pointer;
    transition: var(--momo-transition);

    &:hover:not(.is-disabled) {
      color: var(--momo-color-primary);
    }

    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }

    &.is-active {
      color: var(--momo-color-primary-dark);
    }
  }

  &__content {
    padding-top: 16px;
    font-size: var(--momo-font-size-base);
  }

  &--line {
    .momo-tabs__nav {
      border-bottom: var(--momo-border-width) solid var(--momo-border-soft);
    }

    .momo-tabs__tab.is-active::after {
      content: '';
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: calc(var(--momo-border-width) * -1);
      height: 4px;
      background: var(--momo-color-primary);
      border-radius: var(--momo-radius-round);
      animation: momo-pop-in 0.24s var(--momo-ease-bounce);
    }
  }

  &--card {
    .momo-tabs__tab {
      border: var(--momo-border-width) solid transparent;
      border-radius: var(--momo-radius-base) var(--momo-radius-base) 0 0;
    }

    .momo-tabs__tab.is-active {
      background: var(--momo-bg-card);
      border-color: var(--momo-border-color);
      border-bottom-color: var(--momo-bg-card);
      box-shadow: 0 -3px 0 var(--momo-color-primary-soft) inset;
    }
  }

  &--segment {
    .momo-tabs__nav {
      gap: 4px;
      padding: 4px;
      background: var(--momo-bg-soft);
      border: var(--momo-border-width) solid var(--momo-border-color);
      border-radius: var(--momo-radius-round);
    }

    .momo-tabs__tab {
      border-radius: var(--momo-radius-round);
      padding: 6px 18px;
    }

    .momo-tabs__tab.is-active {
      color: var(--momo-text-primary);
      background: var(--momo-bg-card);
      box-shadow: var(--momo-shadow-xs);
    }
  }
}
</style>

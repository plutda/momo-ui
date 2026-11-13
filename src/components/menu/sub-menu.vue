<script lang="ts">
export interface SubMenuProps {
  index: string
  title: string
  icon?: string
}
</script>

<script setup lang="ts">
import { computed, inject } from 'vue'
import MomoIcon from '../icon/icon.vue'
import { menuContextKey } from './context'

defineOptions({ name: 'MomoSubMenu' })

const props = defineProps<SubMenuProps>()
const menu = inject(menuContextKey, null)

const isOpen = computed(() => menu?.isOpen(props.index) ?? false)

function handleClick() {
  menu?.toggleSubMenu(props.index)
}
</script>

<template>
  <li class="momo-sub-menu">
    <div class="momo-sub-menu__title" :class="{ 'is-open': isOpen }" @click="handleClick">
      <MomoIcon v-if="icon" :name="icon" :size="16" />
      <span class="momo-sub-menu__text">{{ title }}</span>
      <MomoIcon
        name="chevron-down"
        :size="14"
        class="momo-sub-menu__arrow"
        :class="{ 'is-open': isOpen }"
      />
    </div>
    <div v-show="isOpen" class="momo-sub-menu__children">
      <slot />
    </div>
  </li>
</template>

<style lang="scss">
.momo-sub-menu {
  position: relative;
  list-style: none;

  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 16px;
    font-size: var(--momo-font-size-sm);
    font-weight: 700;
    color: var(--momo-text-regular);
    border-radius: var(--momo-radius-base);
    cursor: pointer;
    transition: var(--momo-transition);

    &:hover {
      background: var(--momo-bg-hover);
      color: var(--momo-color-primary-dark);
    }
  }

  &__text {
    flex: 1;
  }

  &__arrow {
    transition: transform 0.24s var(--momo-ease-bounce);

    &.is-open {
      transform: rotate(180deg);
    }
  }

  &__children {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 4px 0 4px 18px;
    animation: momo-fade-in 0.2s var(--momo-ease-out);
  }
}
</style>

<script lang="ts">
export interface BreadcrumbItemProps {
  href?: string
  target?: string
  clickable?: boolean
}
</script>

<script setup lang="ts">
import { inject } from 'vue'
import { breadcrumbContextKey } from './context'

defineOptions({ name: 'MomoBreadcrumbItem' })

const props = withDefaults(defineProps<BreadcrumbItemProps>(), {
  clickable: false,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const breadcrumb = inject(breadcrumbContextKey, null)
</script>

<template>
  <span class="momo-breadcrumb-item">
    <a
      class="momo-breadcrumb-item__link"
      :class="{ 'is-clickable': clickable || href }"
      :href="href"
      :target="target"
      @click="emit('click', $event)"
    >
      <slot />
    </a>
    <span class="momo-breadcrumb-item__separator">
      {{ breadcrumb?.separator.value ?? '/' }}
    </span>
  </span>
</template>

<style lang="scss">
.momo-breadcrumb-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:last-child .momo-breadcrumb-item__separator {
    display: none;
  }

  &:last-child &__link {
    color: var(--momo-text-secondary);
    cursor: default;
    pointer-events: none;
  }

  &__link {
    color: var(--momo-color-primary);
    font-weight: 700;
    text-decoration: none;
    transition: var(--momo-transition-fast);

    &.is-clickable:hover {
      color: var(--momo-color-primary-dark);
      text-decoration: underline wavy;
      text-underline-offset: 3px;
    }
  }

  &__separator {
    color: var(--momo-text-placeholder);
    font-weight: 700;
    user-select: none;
  }
}
</style>

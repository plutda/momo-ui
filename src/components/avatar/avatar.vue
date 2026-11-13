<script lang="ts">
export interface AvatarProps {
  src?: string
  size?: number | 'small' | 'default' | 'large'
  shape?: 'circle' | 'square'
  icon?: string
  alt?: string
  color?: string
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MomoIcon from '../icon/icon.vue'
import { addUnit } from '../../utils/dom'

defineOptions({ name: 'MomoAvatar' })

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'default',
  shape: 'circle',
  icon: 'user',
})

const emit = defineEmits<{ error: [event: Event] }>()

const failed = ref(false)

watch(
  () => props.src,
  () => {
    failed.value = false
  },
)

const sizeMap: Record<string, string> = {
  small: '32px',
  default: '40px',
  large: '56px',
}

const avatarStyle = computed(() => ({
  width: sizeMap[props.size as string] ?? addUnit(props.size),
  height: sizeMap[props.size as string] ?? addUnit(props.size),
  background: props.color,
}))

const showImage = computed(() => !!props.src && !failed.value)

function handleError(event: Event) {
  failed.value = true
  emit('error', event)
}
</script>

<template>
  <span
    class="momo-avatar"
    :class="[`momo-avatar--${shape}`]"
    :style="avatarStyle"
  >
    <img
      v-if="showImage"
      class="momo-avatar__image"
      :src="src"
      :alt="alt"
      @error="handleError"
    />
    <slot v-else>
      <MomoIcon :name="icon" :size="'60%'" />
    </slot>
  </span>
</template>

<style lang="scss">
.momo-avatar {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: var(--momo-text-inverse);
  background: linear-gradient(
    135deg,
    var(--momo-color-primary-light),
    var(--momo-color-primary)
  );
  border: var(--momo-border-width) solid var(--momo-border-color);
  box-shadow: var(--momo-shadow-xs);
  vertical-align: middle;

  &--circle {
    border-radius: 50%;
  }

  &--square {
    border-radius: var(--momo-radius-base);
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  & > .momo-icon {
    width: 60%;
    height: 60%;
  }
}
</style>

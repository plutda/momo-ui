<script lang="ts">
export interface TreeNode {
  key: string | number
  label: string
  disabled?: boolean
  children?: TreeNode[]
}

export interface TreeProps {
  data?: TreeNode[]
  checkable?: boolean
  defaultExpandAll?: boolean
  defaultCheckedKeys?: Array<string | number>
  emptyText?: string
}
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MomoIcon from '../icon/icon.vue'

defineOptions({ name: 'MomoTree' })

const props = withDefaults(defineProps<TreeProps>(), {
  data: () => [],
  checkable: false,
  defaultExpandAll: false,
  defaultCheckedKeys: () => [],
  emptyText: '暂无数据',
})

const emit = defineEmits<{
  check: [node: TreeNode, checked: boolean]
  'check-change': [keys: Array<string | number>]
  'node-click': [node: TreeNode]
  'expand-change': [keys: Array<string | number>]
}>()

const expandedKeys = ref<Set<string | number>>(new Set())
const checkedKeys = ref<Set<string | number>>(new Set())

const nodeMap = computed(() => {
  const map = new Map<
    string | number,
    { node: TreeNode; parent: TreeNode | null }
  >()
  const walk = (nodes: TreeNode[], parent: TreeNode | null) => {
    nodes.forEach((node) => {
      map.set(node.key, { node, parent })
      if (node.children?.length) walk(node.children, node)
    })
  }
  walk(props.data, null)
  return map
})

function collectKeys(node: TreeNode): Array<string | number> {
  const keys: Array<string | number> = [node.key]
  node.children?.forEach((child) => keys.push(...collectKeys(child)))
  return keys
}

onMounted(() => {
  if (props.defaultExpandAll) {
    const keys: Array<string | number> = []
    const walk = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (node.children?.length) {
          keys.push(node.key)
          walk(node.children)
        }
      })
    }
    walk(props.data)
    expandedKeys.value = new Set(keys)
  }
  if (props.defaultCheckedKeys.length) {
    checkedKeys.value = new Set(props.defaultCheckedKeys)
  }
})

const flatNodes = computed(() => {
  const result: Array<{
    node: TreeNode
    level: number
    hasChildren: boolean
  }> = []
  const walk = (nodes: TreeNode[], level: number) => {
    nodes.forEach((node) => {
      const hasChildren = !!node.children?.length
      result.push({ node, level, hasChildren })
      if (hasChildren && expandedKeys.value.has(node.key)) {
        walk(node.children!, level + 1)
      }
    })
  }
  walk(props.data, 0)
  return result
})

function getNodeState(node: TreeNode): 'checked' | 'indeterminate' | 'none' {
  if (!node.children?.length) {
    return checkedKeys.value.has(node.key) ? 'checked' : 'none'
  }
  const states = node.children.map(getNodeState)
  if (states.every((state) => state === 'checked')) return 'checked'
  if (states.every((state) => state === 'none')) {
    return checkedKeys.value.has(node.key) ? 'checked' : 'none'
  }
  return 'indeterminate'
}

function toggleExpand(node: TreeNode) {
  if (!node.children?.length) return
  const next = new Set(expandedKeys.value)
  if (next.has(node.key)) next.delete(node.key)
  else next.add(node.key)
  expandedKeys.value = next
  emit('expand-change', [...next])
}

function toggleCheck(node: TreeNode) {
  if (!props.checkable || node.disabled) return
  const checked = getNodeState(node) !== 'checked'
  const next = new Set(checkedKeys.value)
  collectKeys(node).forEach((key) => {
    if (checked) next.add(key)
    else next.delete(key)
  })

  let parent = nodeMap.value.get(node.key)?.parent ?? null
  while (parent) {
    const childKeys = (parent.children ?? []).map((child) => child.key)
    if (childKeys.every((key) => next.has(key))) next.add(parent.key)
    else next.delete(parent.key)
    parent = nodeMap.value.get(parent.key)?.parent ?? null
  }

  checkedKeys.value = next
  emit('check', node, checked)
  emit('check-change', [...next])
}

function handleNodeClick(node: TreeNode) {
  emit('node-click', node)
  if (node.children?.length) toggleExpand(node)
}
</script>

<template>
  <div class="momo-tree">
    <div
      v-for="item in flatNodes"
      :key="item.node.key"
      class="momo-tree__node"
      :style="{ paddingLeft: `${item.level * 20}px` }"
      @click="handleNodeClick(item.node)"
    >
      <span
        class="momo-tree__arrow"
        :class="{
          'is-expanded': expandedKeys.has(item.node.key),
          'is-leaf': !item.hasChildren,
        }"
        @click.stop="toggleExpand(item.node)"
      >
        <MomoIcon v-if="item.hasChildren" name="chevron-right" :size="14" />
      </span>

      <span
        v-if="checkable"
        class="momo-tree__checkbox"
        :class="[
          `is-${getNodeState(item.node)}`,
          { 'is-disabled': item.node.disabled },
        ]"
        @click.stop="toggleCheck(item.node)"
      >
        <span class="momo-tree__checkbox-inner" />
      </span>

      <span class="momo-tree__label">{{ item.node.label }}</span>
    </div>

    <div v-if="!flatNodes.length" class="momo-tree__empty">
      {{ emptyText }}
    </div>
  </div>
</template>

<style lang="scss">
.momo-tree {
  font-size: var(--momo-font-size-sm);

  &__node {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    border-radius: var(--momo-radius-sm);
    cursor: pointer;
    transition: background 0.14s;

    &:hover {
      background: var(--momo-bg-hover);
    }
  }

  &__arrow {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: var(--momo-text-secondary);
    cursor: pointer;
    transition: transform 0.24s var(--momo-ease-bounce);

    &.is-expanded {
      transform: rotate(90deg);
    }

    &.is-leaf {
      cursor: default;
    }
  }

  &__label {
    flex: 1;
    min-width: 0;
    color: var(--momo-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__checkbox {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: var(--momo-bg-card);
    border: var(--momo-border-width) solid var(--momo-border-color);
    border-radius: var(--momo-radius-xs);
    box-shadow: var(--momo-shadow-xs);
    transition: var(--momo-transition);
  }

  &__checkbox-inner {
    width: 9px;
    height: 5px;
    border: solid var(--momo-text-inverse);
    border-width: 0 0 2.5px 2.5px;
    transform: rotate(-45deg) scale(0) translateY(-1px);
    transition: transform 0.2s var(--momo-ease-bounce);
  }

  &__checkbox.is-checked,
  &__checkbox.is-indeterminate {
    background: var(--momo-color-primary);
    border-color: var(--momo-color-primary-dark);

    .momo-tree__checkbox-inner {
      transform: rotate(-45deg) scale(1) translateY(-1px);
    }
  }

  &__checkbox.is-indeterminate .momo-tree__checkbox-inner {
    width: 9px;
    height: 0;
    border-width: 0 0 2.5px 0;
    transform: rotate(0) scale(1);
  }

  &__checkbox.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &__empty {
    padding: 40px 0;
    color: var(--momo-text-placeholder);
    text-align: center;
  }
}
</style>

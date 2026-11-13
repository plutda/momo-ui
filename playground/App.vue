<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'

interface DemoEntry {
  key: string
  label: string
  emoji: string
  component: Component
}

const modules = import.meta.glob<{ default: Component }>('./demos/*.vue', {
  eager: true,
})

const meta: Record<string, { label: string; emoji: string }> = {
  basic: { label: '基础组件', emoji: '🧱' },
  form: { label: '表单组件', emoji: '📝' },
  data: { label: '数据展示', emoji: '📊' },
  nav: { label: '导航组件', emoji: '🧭' },
  feedback: { label: '反馈组件', emoji: '💬' },
  advanced: { label: '高级组件', emoji: '✨' },
}

const order = ['basic', 'form', 'data', 'nav', 'feedback', 'advanced']

const demos: DemoEntry[] = order
  .filter((key) => modules[`./demos/${key}.vue`])
  .map((key) => ({
    key,
    label: meta[key]?.label ?? key,
    emoji: meta[key]?.emoji ?? '📦',
    component: modules[`./demos/${key}.vue`].default,
  }))

const initialKey = window.location.hash.replace('#', '')
const active = ref(
  demos.some((demo) => demo.key === initialKey)
    ? initialKey
    : (demos[0]?.key ?? ''),
)
const current = computed(() => demos.find((demo) => demo.key === active.value))

watch(active, (key) => {
  if (key) {
    window.history.replaceState(null, '', `#${key}`)
  }
})
</script>

<template>
  <div class="pg">
    <header class="pg-header">
      <div class="pg-brand">
        <span class="pg-logo">🍡</span>
        <div>
          <h1 class="pg-title">Momo UI</h1>
          <p class="pg-subtitle">卡通风格 Vue 3 组件库 · Playground</p>
        </div>
      </div>
      <span class="pg-version">v0.1.0</span>
    </header>

    <div class="pg-body">
      <aside class="pg-side">
        <button
          v-for="demo in demos"
          :key="demo.key"
          type="button"
          class="pg-side-item"
          :class="{ 'is-active': demo.key === active }"
          @click="active = demo.key"
        >
          <span class="pg-side-emoji">{{ demo.emoji }}</span>
          {{ demo.label }}
        </button>
      </aside>

      <main class="pg-main">
        <component :is="current?.component" v-if="current" />
      </main>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  font-family: 'Nunito', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

body {
  margin: 0;
  background: #fbf8ff;
  background-image: radial-gradient(#e6ddff 1.4px, transparent 1.4px);
  background-size: 22px 22px;
}

.pg {
  min-height: 100vh;
}

.pg-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 26px;
  background: rgba(255, 255, 255, 0.86);
  border-bottom: 2px solid var(--momo-border-soft);
  backdrop-filter: blur(10px);
}

.pg-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pg-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  font-size: 24px;
  background: var(--momo-color-primary-soft);
  border: 2px solid var(--momo-border-color);
  border-radius: 14px;
  box-shadow: 3px 3px 0 var(--momo-border-color);
}

.pg-title {
  margin: 0;
  font-size: 21px;
  font-weight: 900;
  letter-spacing: 0.5px;
  color: var(--momo-text-primary);
}

.pg-subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--momo-text-placeholder);
}

.pg-version {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 800;
  color: var(--momo-color-primary);
  background: var(--momo-color-primary-soft);
  border: 1.5px solid var(--momo-color-primary);
  border-radius: 99px;
}

.pg-body {
  display: flex;
  gap: 24px;
  max-width: 1280px;
  padding: 24px;
  margin: 0 auto;
}

.pg-side {
  position: sticky;
  top: 92px;
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: flex-start;
  width: 176px;
}

.pg-side-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 14px;
  font-size: 14px;
  font-weight: 800;
  color: var(--momo-text-regular);
  text-align: left;
  cursor: pointer;
  background: #fff;
  border: 2px solid var(--momo-border-soft);
  border-radius: 14px;
  transition: all 0.2s var(--momo-ease-out);

  &:hover {
    border-color: var(--momo-border-color);
    transform: translateY(-2px);
    box-shadow: 3px 3px 0 var(--momo-border-soft);
  }

  &.is-active {
    color: var(--momo-text-inverse);
    background: var(--momo-color-primary);
    border-color: var(--momo-border-color);
    box-shadow: 3px 3px 0 var(--momo-border-color);
    transform: translateY(-1px);
  }
}

.pg-side-emoji {
  font-size: 16px;
}

.pg-main {
  flex: 1;
  min-width: 0;
  padding-bottom: 60px;
}

/* ---------- demo 公共样式 ---------- */
.demo-section {
  padding: 20px 24px;
  margin-bottom: 22px;
  background: #fff;
  border: 2px solid var(--momo-border-color);
  border-radius: 20px;
  box-shadow: 5px 5px 0 var(--momo-border-soft);
}

.demo-section__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 900;
  color: var(--momo-text-primary);

  &::before {
    width: 10px;
    height: 10px;
    content: '';
    background: var(--momo-color-primary);
    border: 2px solid var(--momo-border-color);
    border-radius: 50%;
  }
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.demo-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;

  &:last-child {
    margin-bottom: 0;
  }
}

.demo-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--momo-text-placeholder);
}

.demo-box {
  padding: 14px;
  font-size: 13px;
  font-weight: 700;
  color: var(--momo-color-primary-dark);
  text-align: center;
  background: var(--momo-color-primary-soft);
  border: 1.5px dashed var(--momo-color-primary);
  border-radius: 12px;
}

.demo-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.demo-narrow {
  max-width: 280px;
}

.demo-panel {
  padding: 16px;
  background: var(--momo-bg-soft);
  border: 1.5px solid var(--momo-border-soft);
  border-radius: 14px;
}
</style>

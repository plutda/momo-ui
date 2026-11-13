<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'
import Docs from './Docs.vue'

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
const initialDemo = demos.some((demo) => demo.key === initialKey)
const view = ref<'docs' | 'demo'>(initialDemo ? 'demo' : 'docs')
const active = ref(
  initialDemo
    ? initialKey
    : (demos[0]?.key ?? ''),
)
const current = computed(() => demos.find((demo) => demo.key === active.value))

watch([view, active], ([nextView, key]) => {
  const hash = nextView === 'demo' && key ? key : 'docs'
  window.history.replaceState(null, '', `#${hash}`)
})

function showDocs() {
  view.value = 'docs'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function showDemo(key = active.value || demos[0]?.key || 'basic') {
  active.value = key
  view.value = 'demo'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="pg">
    <header class="pg-header">
      <div class="pg-brand">
        <span class="pg-logo">🍡</span>
        <div>
          <h1 class="pg-title">Momo UI</h1>
          <p class="pg-subtitle">卡通风格 Vue 3 组件库</p>
        </div>
      </div>
      <div class="pg-header__actions">
        <nav class="pg-nav" aria-label="主导航">
          <button
            type="button"
            :class="{ 'is-active': view === 'docs' }"
            @click="showDocs"
          >
            文档
          </button>
          <button
            type="button"
            :class="{ 'is-active': view === 'demo' }"
            @click="showDemo()"
          >
            组件示例
          </button>
        </nav>
        <a
          class="pg-github"
          href="https://github.com/plutda/momo-ui"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
        <span class="pg-version">v0.1.0</span>
      </div>
    </header>

    <div class="pg-body" :class="{ 'pg-body--docs': view === 'docs' }">
      <aside v-if="view === 'demo'" class="pg-side">
        <span class="pg-side-title">组件分类</span>
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

      <main class="pg-main" :class="{ 'pg-main--docs': view === 'docs' }">
        <Docs v-if="view === 'docs'" @navigate="showDemo" />
        <component :is="current?.component" v-else-if="current" />
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
  overflow-x: hidden;
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

.pg-header__actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.pg-nav {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--momo-bg-soft);
  border: 1.5px solid var(--momo-border-soft);
  border-radius: 12px;

  button {
    padding: 7px 13px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 800;
    color: var(--momo-text-secondary);
    cursor: pointer;
    background: transparent;
    border: 0;
    border-radius: 8px;
    transition: var(--momo-transition-fast);

    &:hover {
      color: var(--momo-text-primary);
      background: #fff;
    }

    &.is-active {
      color: var(--momo-text-primary);
      background: #fff;
      box-shadow: 0 2px 7px rgba(45, 42, 62, 0.09);
    }
  }
}

.pg-github {
  padding: 7px 11px;
  font-size: 12px;
  font-weight: 800;
  color: var(--momo-text-regular);
  text-decoration: none;
  border: 1.5px solid var(--momo-border-soft);
  border-radius: 10px;
  transition: var(--momo-transition-fast);

  &:hover {
    color: var(--momo-color-primary);
    border-color: var(--momo-color-primary-light);
  }
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

.pg-body--docs {
  display: block;
  max-width: none;
  padding: 0;
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

.pg-side-title {
  padding: 0 8px 4px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1px;
  color: var(--momo-text-placeholder);
  text-transform: uppercase;
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

.pg-main--docs {
  padding-bottom: 0;
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

@media (max-width: 820px) {
  .pg-header {
    gap: 12px;
    padding: 12px 16px;
  }

  .pg-header__actions {
    gap: 8px;
  }

  .pg-version {
    display: none;
  }

  .pg-body {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .pg-body--docs {
    padding: 0;
  }

  .pg-side {
    position: static;
    flex-direction: row;
    width: 100%;
    padding-bottom: 4px;
    overflow-x: auto;
  }

  .pg-side-title {
    display: none;
  }

  .pg-side-item {
    flex: none;
  }
}

@media (max-width: 560px) {
  .pg-header {
    position: relative;
    align-items: flex-start;
    flex-direction: column;
  }

  .pg-header__actions {
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
  }

  .pg-github {
    margin-left: 0;
  }
}
</style>

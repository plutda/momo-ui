<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  navigate: [key: string]
}>()

const copied = ref('')
let copiedTimer: number | undefined

const installCommand = 'pnpm add momo-ui'
const fullImportCode = `import { createApp } from 'vue'
import MomoUI from 'momo-ui'
import 'momo-ui/style.css'
import App from './App.vue'

createApp(App).use(MomoUI).mount('#app')`
const onDemandCode = `import { MomoButton, MomoInput } from 'momo-ui'
import 'momo-ui/style.css'`
const messageCode = `import { MomoMessage } from 'momo-ui'

MomoMessage.success('保存成功 🍡')`
const themeCode = `:root {
  --momo-color-primary: #ff8fab;
  --momo-radius-base: 16px;
  --momo-border-width: 3px;
}`

const categories = [
  {
    key: 'basic',
    emoji: '🧱',
    title: '基础组件',
    description: '页面搭建的积木，简洁、统一、易组合。',
    components: 'Button · Icon · Card · Tag · Avatar',
  },
  {
    key: 'form',
    emoji: '📝',
    title: '表单组件',
    description: '覆盖常见录入与校验场景。',
    components: 'Input · Select · Switch · Form',
  },
  {
    key: 'data',
    emoji: '📊',
    title: '数据展示',
    description: '清晰呈现复杂信息与数据关系。',
    components: 'Table · Tree · Timeline · Carousel',
  },
  {
    key: 'nav',
    emoji: '🧭',
    title: '导航组件',
    description: '建立明确的页面层级与操作路径。',
    components: 'Menu · Tabs · Steps · Breadcrumb',
  },
  {
    key: 'feedback',
    emoji: '💬',
    title: '反馈组件',
    description: '及时反馈状态，让操作更有回应。',
    components: 'Message · Dialog · Drawer · Loading',
  },
  {
    key: 'advanced',
    emoji: '✨',
    title: '高级组件',
    description: '面向真实业务场景的复杂交互。',
    components: 'DatePicker · Upload · 组合示例',
  },
]

async function copyCode(id: string, code: string) {
  await navigator.clipboard?.writeText(code)
  copied.value = id
  window.clearTimeout(copiedTimer)
  copiedTimer = window.setTimeout(() => {
    copied.value = ''
  }, 1600)
}
</script>

<template>
  <div class="docs">
    <section class="docs-hero">
      <div class="docs-hero__copy">
        <div class="docs-eyebrow">
          <span class="docs-eyebrow__dot" />
          Vue 3 · TypeScript · MIT
        </div>
        <h1 class="docs-hero__title">
          可爱的界面，<br />
          <span>专业的组件。</span>
        </h1>
        <p class="docs-hero__description">
          Momo UI 是一套卡通风格的 Vue 3 组件库。粗描边、硬投影、糖果色与果冻动效，
          让每一次交互都轻松又有趣。
        </p>
        <div class="docs-hero__actions">
          <momo-button type="primary" size="large" round @click="emit('navigate', 'basic')">
            浏览 60+ 组件
          </momo-button>
          <a
            class="docs-link-button"
            href="https://github.com/plutda/momo-ui"
            target="_blank"
            rel="noreferrer"
          >
            GitHub 源码 ↗
          </a>
        </div>
        <div class="docs-hero__meta">
          <span>无需额外配置</span>
          <span>CSS 变量换肤</span>
          <span>完整类型提示</span>
        </div>
      </div>

      <div class="docs-hero__visual" aria-hidden="true">
        <div class="docs-hero__shape docs-hero__shape--one" />
        <div class="docs-hero__shape docs-hero__shape--two" />
        <div class="docs-preview">
          <div class="docs-preview__top">
            <span class="docs-preview__logo">🍡</span>
            <div>
              <strong>今日进展</strong>
              <span>Momo UI Workspace</span>
            </div>
            <span class="docs-preview__status" />
          </div>
          <div class="docs-preview__task">
            <div>
              <span class="docs-preview__caption">当前任务</span>
              <strong>组件视觉走查</strong>
            </div>
            <momo-tag type="success" round>已完成</momo-tag>
          </div>
          <div class="docs-preview__progress">
            <div class="docs-preview__row">
              <span>整体完成度</span>
              <strong>82%</strong>
            </div>
            <momo-progress :percentage="82" :stroke-width="10" />
          </div>
          <div class="docs-preview__footer">
            <div class="docs-preview__avatars">
              <span>🍬</span>
              <span>🐻</span>
              <span>🍓</span>
            </div>
            <momo-button type="primary" size="small" round>查看详情</momo-button>
          </div>
        </div>
        <div class="docs-sticker docs-sticker--theme">CSS Variables</div>
        <div class="docs-sticker docs-sticker--motion">Jelly Motion ✦</div>
      </div>
    </section>

    <section class="docs-stats" aria-label="项目统计">
      <div>
        <strong>60+</strong>
        <span>开箱即用的组件</span>
      </div>
      <div>
        <strong>6</strong>
        <span>组件分类</span>
      </div>
      <div>
        <strong>100%</strong>
        <span>TypeScript 类型</span>
      </div>
      <div>
        <strong>0</strong>
        <span>额外样式依赖</span>
      </div>
    </section>

    <section id="install" class="docs-section docs-start">
      <div class="docs-section__heading">
        <span class="docs-section__index">01</span>
        <div>
          <p class="docs-section__eyebrow">Getting started</p>
          <h2>三步，开始使用</h2>
          <p>安装依赖、注册组件、引入样式，即可在 Vue 3 项目中使用。</p>
        </div>
      </div>

      <div class="docs-start__grid">
        <div class="docs-start__steps">
          <div class="docs-step">
            <span>1</span>
            <div>
              <strong>安装 Momo UI</strong>
              <p>Vue 3 会作为 peer dependency 自动配合使用。</p>
            </div>
          </div>
          <div class="docs-step">
            <span>2</span>
            <div>
              <strong>注册组件</strong>
              <p>支持全量注册，也可以按需导入，保持包体精简。</p>
            </div>
          </div>
          <div class="docs-step">
            <span>3</span>
            <div>
              <strong>开始构建</strong>
              <p>所有组件共享同一套设计变量，主题风格自然统一。</p>
            </div>
          </div>
        </div>

        <div class="docs-code-stack">
          <div class="docs-code">
            <div class="docs-code__bar">
              <span>Terminal</span>
              <button type="button" @click="copyCode('install', installCommand)">
                {{ copied === 'install' ? '已复制' : '复制' }}
              </button>
            </div>
            <pre><code>{{ installCommand }}</code></pre>
          </div>
          <div class="docs-code">
            <div class="docs-code__bar">
              <span>main.ts</span>
              <button type="button" @click="copyCode('import', fullImportCode)">
                {{ copied === 'import' ? '已复制' : '复制' }}
              </button>
            </div>
            <pre><code>{{ fullImportCode }}</code></pre>
          </div>
        </div>
      </div>
    </section>

    <section id="usage" class="docs-section">
      <div class="docs-section__heading">
        <span class="docs-section__index">02</span>
        <div>
          <p class="docs-section__eyebrow">Usage</p>
          <h2>按你的方式接入</h2>
          <p>从全量注册到按需导入，再到函数式反馈组件，保持简单而灵活。</p>
        </div>
      </div>

      <div class="docs-usage-grid">
        <article class="docs-usage-card">
          <span class="docs-usage-card__icon">🍬</span>
          <h3>全量注册</h3>
          <p>适合快速搭建和原型开发，一次注册即可使用所有组件。</p>
          <div class="docs-code docs-code--compact">
            <div class="docs-code__bar">
              <span>main.ts</span>
              <button type="button" @click="copyCode('full', fullImportCode)">
                {{ copied === 'full' ? '已复制' : '复制' }}
              </button>
            </div>
            <pre><code>{{ fullImportCode }}</code></pre>
          </div>
        </article>
        <article class="docs-usage-card">
          <span class="docs-usage-card__icon">🧩</span>
          <h3>按需引入</h3>
          <p>只引入当前页面需要的组件，适合生产项目精细控制依赖。</p>
          <div class="docs-code docs-code--compact">
            <div class="docs-code__bar">
              <span>App.vue</span>
              <button type="button" @click="copyCode('demand', onDemandCode)">
                {{ copied === 'demand' ? '已复制' : '复制' }}
              </button>
            </div>
            <pre><code>{{ onDemandCode }}</code></pre>
          </div>
        </article>
        <article class="docs-usage-card">
          <span class="docs-usage-card__icon">💬</span>
          <h3>全局消息</h3>
          <p>Message 与 Notification 使用函数式 API，无需额外声明组件。</p>
          <div class="docs-code docs-code--compact">
            <div class="docs-code__bar">
              <span>script.ts</span>
              <button type="button" @click="copyCode('message', messageCode)">
                {{ copied === 'message' ? '已复制' : '复制' }}
              </button>
            </div>
            <pre><code>{{ messageCode }}</code></pre>
          </div>
        </article>
      </div>
    </section>

    <section id="components" class="docs-section">
      <div class="docs-section__heading docs-section__heading--split">
        <div class="docs-section__heading-main">
          <span class="docs-section__index">03</span>
          <div>
            <p class="docs-section__eyebrow">Components</p>
            <h2>覆盖完整业务场景</h2>
            <p>从基础元素到日期选择、文件上传，所有示例都可以直接体验。</p>
          </div>
        </div>
        <button class="docs-text-button" type="button" @click="emit('navigate', 'basic')">
          查看全部示例 →
        </button>
      </div>

      <div class="docs-categories">
        <button
          v-for="category in categories"
          :key="category.key"
          type="button"
          class="docs-category"
          @click="emit('navigate', category.key)"
        >
          <span class="docs-category__emoji">{{ category.emoji }}</span>
          <span class="docs-category__body">
            <strong>{{ category.title }}</strong>
            <span>{{ category.description }}</span>
            <small>{{ category.components }}</small>
          </span>
          <span class="docs-category__arrow">↗</span>
        </button>
      </div>
    </section>

    <section id="theme" class="docs-section docs-theme">
      <div class="docs-section__heading">
        <span class="docs-section__index">04</span>
        <div>
          <p class="docs-section__eyebrow">Theming</p>
          <h2>一套变量，轻松换肤</h2>
          <p>颜色、圆角、描边、阴影与动效全部以 CSS 变量暴露，无需覆盖组件内部样式。</p>
        </div>
      </div>

      <div class="docs-theme__grid">
        <div class="docs-tokens">
          <div class="docs-token">
            <span class="docs-token__swatch docs-token__swatch--primary" />
            <div><strong>Primary</strong><code>#7c5cff</code></div>
          </div>
          <div class="docs-token">
            <span class="docs-token__swatch docs-token__swatch--honey" />
            <div><strong>Honey</strong><code>#ffb020</code></div>
          </div>
          <div class="docs-token">
            <span class="docs-token__swatch docs-token__swatch--ink" />
            <div><strong>Ink</strong><code>#2d2a3e</code></div>
          </div>
          <div class="docs-token docs-token--radius">
            <span class="docs-token__swatch docs-token__swatch--radius" />
            <div><strong>Radius</strong><code>24px</code></div>
          </div>
        </div>
        <div class="docs-code docs-theme__code">
          <div class="docs-code__bar">
            <span>theme.css</span>
            <button type="button" @click="copyCode('theme', themeCode)">
              {{ copied === 'theme' ? '已复制' : '复制' }}
            </button>
          </div>
          <pre><code>{{ themeCode }}</code></pre>
        </div>
      </div>
    </section>

    <footer class="docs-footer">
      <div>
        <span class="docs-footer__logo">🍡</span>
        <div>
          <strong>Momo UI</strong>
          <span>让界面多一点可爱，也少一点复杂。</span>
        </div>
      </div>
      <div class="docs-footer__links">
        <a href="https://github.com/plutda/momo-ui" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://github.com/plutda/momo-ui#readme" target="_blank" rel="noreferrer">
          README
        </a>
        <span>MIT License</span>
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
.docs {
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
  padding-bottom: 48px;
}

.docs-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(340px, 0.92fr);
  gap: 64px;
  align-items: center;
  min-height: 560px;
  padding: 64px 0 48px;
}

.docs-hero__copy,
.docs-hero__visual {
  min-width: 0;
}

.docs-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 800;
  color: var(--momo-color-primary-dark);
  background: var(--momo-color-primary-soft);
  border: 1.5px solid var(--momo-color-primary-light);
  border-radius: 999px;
}

.docs-eyebrow__dot {
  width: 7px;
  height: 7px;
  background: var(--momo-color-success);
  border: 1.5px solid var(--momo-border-color);
  border-radius: 50%;
}

.docs-hero__title {
  margin: 22px 0 20px;
  font-size: clamp(46px, 6.2vw, 74px);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -2.5px;
  color: var(--momo-text-primary);

  span {
    position: relative;
    z-index: 0;
    color: var(--momo-color-primary);

    &::after {
      position: absolute;
      right: 2px;
      bottom: 5px;
      left: 2px;
      z-index: -1;
      height: 16px;
      content: '';
      background: var(--momo-color-secondary-soft);
      border-radius: 4px;
      transform: rotate(-1.5deg);
    }
  }
}

.docs-hero__description {
  max-width: 590px;
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.85;
  color: var(--momo-text-regular);
}

.docs-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 32px;
}

.docs-link-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 22px;
  font-size: 15px;
  font-weight: 800;
  color: var(--momo-text-primary);
  text-decoration: none;
  background: #fff;
  border: 2px solid var(--momo-border-color);
  border-radius: 999px;
  box-shadow: var(--momo-shadow-sm);
  transition: var(--momo-transition);

  &:hover {
    box-shadow: var(--momo-shadow-lg);
    transform: translate(-1px, -1px);
  }
}

.docs-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 24px;
  font-size: 12px;
  font-weight: 700;
  color: var(--momo-text-secondary);

  span::before {
    margin-right: 5px;
    color: var(--momo-color-success);
    content: '✓';
  }
}

.docs-hero__visual {
  position: relative;
  padding: 28px 10px;
}

.docs-hero__shape {
  position: absolute;
  border: 2px solid var(--momo-border-color);

  &--one {
    top: 2px;
    right: -12px;
    width: 150px;
    height: 150px;
    background: var(--momo-color-secondary-soft);
    border-radius: 43% 57% 62% 38% / 44% 37% 63% 56%;
    transform: rotate(12deg);
  }

  &--two {
    bottom: 0;
    left: -18px;
    width: 100px;
    height: 100px;
    background: var(--momo-color-success-soft);
    border-radius: 50%;
  }
}

.docs-preview {
  position: relative;
  z-index: 2;
  padding: 22px;
  background: #fff;
  border: 2px solid var(--momo-border-color);
  border-radius: 24px;
  box-shadow: 9px 9px 0 var(--momo-border-color);
  transform: rotate(1.2deg);
}

.docs-preview__top,
.docs-preview__task,
.docs-preview__row,
.docs-preview__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.docs-preview__top {
  gap: 12px;
  justify-content: flex-start;
  padding-bottom: 18px;
  border-bottom: 1.5px dashed var(--momo-border-soft);

  div {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
  }

  strong {
    font-size: 14px;
    font-weight: 900;
  }

  span {
    font-size: 11px;
    font-weight: 700;
    color: var(--momo-text-secondary);
  }
}

.docs-preview__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  font-size: 22px !important;
  background: var(--momo-color-primary-soft);
  border: 2px solid var(--momo-border-color);
  border-radius: 13px;
}

.docs-preview__status {
  width: 9px;
  height: 9px;
  background: var(--momo-color-success);
  border: 1.5px solid var(--momo-border-color);
  border-radius: 50%;
}

.docs-preview__task {
  padding: 20px 16px;
  margin: 18px 0;
  background: var(--momo-bg-soft);
  border: 1.5px solid var(--momo-border-soft);
  border-radius: 16px;

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    font-size: 16px;
    font-weight: 900;
  }
}

.docs-preview__caption {
  font-size: 11px;
  font-weight: 800;
  color: var(--momo-text-secondary);
}

.docs-preview__progress {
  padding: 4px 2px 20px;
}

.docs-preview__row {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 800;
  color: var(--momo-text-secondary);

  strong {
    color: var(--momo-text-primary);
  }
}

.docs-preview__footer {
  padding-top: 17px;
  border-top: 1.5px dashed var(--momo-border-soft);
}

.docs-preview__avatars {
  display: flex;

  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    margin-left: -7px;
    font-size: 14px;
    background: #fff;
    border: 1.5px solid var(--momo-border-color);
    border-radius: 50%;

    &:first-child {
      margin-left: 0;
    }
  }
}

.docs-sticker {
  position: absolute;
  z-index: 3;
  padding: 8px 13px;
  font-size: 11px;
  font-weight: 900;
  background: #fff;
  border: 2px solid var(--momo-border-color);
  border-radius: 999px;
  box-shadow: var(--momo-shadow-sm);

  &--theme {
    top: 12px;
    left: -28px;
    color: var(--momo-color-primary-dark);
    transform: rotate(-6deg);
  }

  &--motion {
    right: -18px;
    bottom: 34px;
    color: #8a5a00;
    background: var(--momo-color-secondary-soft);
    transform: rotate(5deg);
  }
}

.docs-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 84px;
  overflow: hidden;
  background: #fff;
  border: 2px solid var(--momo-border-color);
  border-radius: 20px;
  box-shadow: 5px 5px 0 var(--momo-border-soft);

  div {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    padding: 22px 12px;
    border-right: 1.5px dashed var(--momo-border-soft);

    &:last-child {
      border-right: 0;
    }
  }

  strong {
    font-size: 24px;
    font-weight: 900;
    color: var(--momo-color-primary);
  }

  span {
    font-size: 12px;
    font-weight: 700;
    color: var(--momo-text-secondary);
  }
}

.docs-section {
  padding: 78px 0;
  border-top: 2px dashed var(--momo-border-soft);
  scroll-margin-top: 90px;
}

.docs-section__heading {
  display: flex;
  gap: 22px;
  align-items: flex-start;
  margin-bottom: 36px;

  h2 {
    margin: 5px 0 9px;
    font-size: clamp(28px, 3.4vw, 38px);
    font-weight: 900;
    letter-spacing: -0.8px;
    color: var(--momo-text-primary);
  }

  p:last-child {
    max-width: 620px;
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.75;
    color: var(--momo-text-secondary);
  }
}

.docs-section__heading--split {
  justify-content: space-between;
}

.docs-section__heading-main {
  display: flex;
  gap: 22px;
  align-items: flex-start;
}

.docs-section__index {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  margin-top: 4px;
  font-size: 12px;
  font-weight: 900;
  color: var(--momo-color-primary-dark);
  background: var(--momo-color-primary-soft);
  border: 1.5px solid var(--momo-color-primary-light);
  border-radius: 12px;
}

.docs-section__eyebrow {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--momo-color-primary);
}

.docs-start__grid {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 28px;
}

.docs-start__steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.docs-step {
  display: flex;
  gap: 15px;
  padding: 18px;
  background: #fff;
  border: 1.5px solid var(--momo-border-soft);
  border-radius: 16px;

  > span {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    font-size: 12px;
    font-weight: 900;
    color: #fff;
    background: var(--momo-color-primary);
    border: 1.5px solid var(--momo-border-color);
    border-radius: 9px;
    box-shadow: 2px 2px 0 var(--momo-border-color);
  }

  strong {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 900;
  }

  p {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.65;
    color: var(--momo-text-secondary);
  }
}

.docs-code-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.docs-code {
  overflow: hidden;
  background: #252139;
  border: 2px solid var(--momo-border-color);
  border-radius: 17px;
  box-shadow: 4px 4px 0 var(--momo-border-soft);

  pre {
    padding: 18px 20px 20px;
    margin: 0;
    overflow-x: auto;
  }

  code {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
    font-size: 12px;
    line-height: 1.75;
    color: #eeeaff;
    white-space: pre;
  }
}

.docs-code__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 13px 9px 18px;
  background: #302a4b;
  border-bottom: 1px solid #484064;

  span {
    font-family: 'SFMono-Regular', Consolas, monospace;
    font-size: 10px;
    font-weight: 700;
    color: #bdb4dd;
  }

  button {
    padding: 4px 9px;
    font-family: inherit;
    font-size: 10px;
    font-weight: 800;
    color: #e9e4ff;
    cursor: pointer;
    background: #443c62;
    border: 1px solid #665a8c;
    border-radius: 7px;
    transition: var(--momo-transition-fast);

    &:hover {
      background: #584d7c;
    }
  }
}

.docs-usage-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.docs-usage-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 22px;
  background: #fff;
  border: 2px solid var(--momo-border-color);
  border-radius: 20px;
  box-shadow: 4px 4px 0 var(--momo-border-soft);

  h3 {
    margin: 14px 0 7px;
    font-size: 17px;
    font-weight: 900;
  }

  > p {
    min-height: 46px;
    margin: 0 0 18px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.7;
    color: var(--momo-text-secondary);
  }
}

.docs-usage-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  font-size: 19px;
  background: var(--momo-color-primary-soft);
  border: 1.5px solid var(--momo-color-primary-light);
  border-radius: 12px;
}

.docs-code--compact {
  margin-top: auto;
  box-shadow: none;

  pre {
    min-height: 144px;
    padding: 14px;
  }

  code {
    font-size: 10px;
  }
}

.docs-text-button {
  flex: none;
  padding: 9px 0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 900;
  color: var(--momo-color-primary);
  cursor: pointer;
  background: transparent;
  border: 0;

  &:hover {
    color: var(--momo-color-primary-dark);
  }
}

.docs-categories {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.docs-category {
  position: relative;
  display: flex;
  gap: 15px;
  align-items: flex-start;
  padding: 21px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  background: #fff;
  border: 2px solid var(--momo-border-soft);
  border-radius: 18px;
  transition: var(--momo-transition);

  &:hover {
    border-color: var(--momo-border-color);
    box-shadow: 4px 4px 0 var(--momo-color-primary-soft);
    transform: translateY(-3px);
  }

  &:hover .docs-category__arrow {
    color: var(--momo-color-primary);
    transform: translate(2px, -2px);
  }
}

.docs-category__emoji {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  font-size: 21px;
  background: var(--momo-bg-soft);
  border: 1.5px solid var(--momo-border-soft);
  border-radius: 13px;
}

.docs-category__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;

  strong {
    font-size: 15px;
    font-weight: 900;
  }

  span {
    font-size: 11px;
    font-weight: 600;
    line-height: 1.55;
    color: var(--momo-text-secondary);
  }

  small {
    margin-top: 4px;
    font-size: 10px;
    font-weight: 700;
    color: var(--momo-color-primary);
  }
}

.docs-category__arrow {
  font-size: 15px;
  font-weight: 900;
  color: var(--momo-text-placeholder);
  transition: var(--momo-transition);
}

.docs-theme__grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 28px;
}

.docs-tokens {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 13px;
}

.docs-token {
  display: flex;
  gap: 11px;
  align-items: center;
  padding: 14px;
  background: #fff;
  border: 1.5px solid var(--momo-border-soft);
  border-radius: 14px;

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  strong {
    font-size: 12px;
    font-weight: 900;
  }

  code {
    font-size: 10px;
    font-weight: 700;
    color: var(--momo-text-secondary);
  }
}

.docs-token__swatch {
  display: inline-block;
  flex: none;
  width: 32px;
  height: 32px;
  border: 1.5px solid var(--momo-border-color);
  border-radius: 10px;

  &--primary {
    background: var(--momo-color-primary);
  }

  &--honey {
    background: var(--momo-color-secondary);
  }

  &--ink {
    background: var(--momo-text-primary);
  }

  &--radius {
    background: var(--momo-color-primary-soft);
    border-radius: 16px;
  }
}

.docs-theme__code {
  box-shadow: 4px 4px 0 var(--momo-color-primary-soft);
}

.docs-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 0 10px;
  border-top: 2px dashed var(--momo-border-soft);

  > div:first-child {
    display: flex;
    gap: 11px;
    align-items: center;

    div {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    strong {
      font-size: 15px;
      font-weight: 900;
    }

    span:last-child {
      font-size: 11px;
      font-weight: 600;
      color: var(--momo-text-secondary);
    }
  }
}

.docs-footer__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  font-size: 19px;
  background: var(--momo-color-primary-soft);
  border: 1.5px solid var(--momo-border-color);
  border-radius: 12px;
}

.docs-footer__links {
  display: flex;
  gap: 20px;
  font-size: 11px;
  font-weight: 700;
  color: var(--momo-text-secondary);

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: var(--momo-color-primary);
    }
  }
}

@media (max-width: 960px) {
  .docs-hero {
    grid-template-columns: 1fr;
    gap: 16px;
    padding-top: 44px;
  }

  .docs-hero__copy {
    max-width: 680px;
  }

  .docs-hero__visual {
    width: min(480px, 100%);
    margin: 20px auto 0;
  }

  .docs-stats {
    grid-template-columns: repeat(2, 1fr);

    div:nth-child(2) {
      border-right: 0;
    }

    div:nth-child(-n + 2) {
      border-bottom: 1.5px dashed var(--momo-border-soft);
    }
  }

  .docs-start__grid,
  .docs-theme__grid {
    grid-template-columns: 1fr;
  }

  .docs-usage-grid,
  .docs-categories {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .docs {
    width: calc(100% - 32px);
    max-width: 1120px;
  }

  .docs-hero {
    min-height: 0;
    padding-top: 36px;
  }

  .docs-hero__title {
    font-size: 44px;
    letter-spacing: -1.5px;
  }

  .docs-hero__description {
    font-size: 15px;
  }

  .docs-hero__visual {
    width: 100%;
    padding: 26px 6px;
    overflow: hidden;
  }

  .docs-preview {
    padding: 18px;
    box-shadow: 6px 6px 0 var(--momo-border-color);
    transform: none;
  }

  .docs-hero__shape--one {
    right: -48px;
  }

  .docs-hero__shape--two {
    left: -36px;
  }

  .docs-stats {
    margin-bottom: 52px;

    div {
      flex-direction: column;
      gap: 2px;
    }
  }

  .docs-sticker--theme {
    left: 2px;
  }

  .docs-sticker--motion {
    right: 2px;
  }

  .docs-section {
    padding: 56px 0;
  }

  .docs-section__heading,
  .docs-section__heading-main {
    gap: 14px;
  }

  .docs-section__heading--split {
    flex-direction: column;
  }

  .docs-section__index {
    width: 32px;
    height: 32px;
  }

  .docs-usage-grid,
  .docs-categories,
  .docs-tokens {
    grid-template-columns: minmax(0, 1fr);
  }

  .docs-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 20px;
  }
}
</style>

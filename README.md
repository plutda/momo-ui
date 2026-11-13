# 🍡 Momo UI

> 卡通风格的 Vue 3 基础组件库 —— 粗描边、硬投影、糖果色、果冻动效，组件齐全，开箱即用。

- 🧱 **60+ 组件**：覆盖基础、表单、数据展示、导航、反馈、高级六大类
- 🎨 **CSS 变量主题**：所有颜色 / 圆角 / 阴影 / 动效均以 token 暴露，覆盖 `:root` 即可换肤
- 🧩 **TypeScript**：完整类型定义，SFC + `<script setup>`
- 🍬 **卡通设计语言**：2px 描边、4px 硬投影、大圆角、`cubic-bezier(0.34, 1.56, 0.64, 1)` 果冻缓动
- 🧪 **Playground**：内置演示站，覆盖全部组件用法

## 安装

```bash
pnpm add momo-ui
# 或 npm i momo-ui / yarn add momo-ui
```

`vue` 为 peer dependency（^3.3.0）。

## 快速开始

### 全量引入

```ts
// main.ts
import { createApp } from 'vue'
import MomoUI from 'momo-ui'
import 'momo-ui/style.css'
import App from './App.vue'

createApp(App).use(MomoUI).mount('#app')
```

注册后即可在任意模板中使用：

```vue
<template>
  <momo-button type="primary" @click="MomoMessage.success('你好呀 🍡')">
    点我
  </momo-button>
</template>
```

### 按需引入

```vue
<script setup lang="ts">
import { MomoButton, MomoInput } from 'momo-ui'
import 'momo-ui/style.css'
</script>
```

### 全局消息 / 通知

`MomoMessage` 与 `MomoNotification` 是函数式 API，无需在模板中声明：

```ts
import { MomoMessage, MomoNotification } from 'momo-ui'

MomoMessage.success('保存成功')
MomoMessage.warning({ message: '磁盘空间不足', duration: 5000 })
MomoNotification.error({ title: '部署失败', message: 'momo-order 发布超时' })
```

### 加载指令

```ts
import { vLoading } from 'momo-ui'
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { vLoading } from 'momo-ui'

const loading = ref(true)
</script>

<template>
  <div v-loading="loading" style="height: 200px">内容区域</div>
</template>
```

也支持对象形式：`v-loading="{ text: '拼命加载中…', size: 48 }"`。

## 主题定制

所有设计 token 都是 CSS 变量，定义在 `:root`。在项目样式中覆盖即可：

```css
:root {
  /* 主色换成樱花粉 */
  --momo-color-primary: #ff8fab;
  --momo-color-primary-dark: #e56f8d;
  --momo-color-primary-soft: #ffe8ef;

  /* 更圆的按钮 */
  --momo-radius-base: 16px;
  --momo-radius-lg: 22px;

  /* 更粗的描边 */
  --momo-border-width: 3px;
}
```

完整 token 列表见 [`src/styles/variables.scss`](src/styles/variables.scss)。

## 组件清单

| 分类 | 组件 |
|---|---|
| **基础** | Icon、Button、Link、Divider、Space、Row、Col、Card、Tag、Badge、Avatar |
| **表单** | Input、InputNumber、Radio / RadioGroup、Checkbox / CheckboxGroup、Switch、Select、Slider、Rate、Form / FormItem、DatePicker、Upload |
| **数据展示** | Table、Pagination、Collapse / CollapseItem、Tabs / TabPane、Timeline / TimelineItem、Tree、Carousel / CarouselItem、Descriptions、Statistic、Empty、Skeleton、Progress |
| **导航** | Breadcrumb / BreadcrumbItem、Steps / Step、Dropdown / DropdownItem、Menu / MenuItem / SubMenu、BackTop |
| **反馈** | Alert、Message、Notification、Dialog、Drawer、Tooltip、Popover、Popconfirm、Loading（含 `v-loading`）、Result |
| **高级** | DatePicker（date / daterange）、Upload（拖拽 / 图片列表 / 自定义 `httpRequest`） |

## 设计规范

| Token | 值 | 说明 |
|---|---|---|
| 描边 | `2px solid #2d2a3e` | 统一的“墨线”描边 |
| 阴影 | `4px 4px 0 rgba(45, 42, 62, 0.9)` | 硬投影，不使用模糊 |
| 圆角 | 6 / 9 / 13 / 18 / 24 / 999px | 大圆角，按钮可 pill |
| 主色 | `#7c5cff` | 糖果紫 |
| 辅色 | `#ffb020` | 蜂蜜黄 |
| 成功 / 警告 / 危险 / 信息 | `#2ed573` / `#ffa502` / `#ff4757` / `#54a0ff` | 糖果色盘 |
| 缓动 | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 果冻回弹 |

## 本地开发

```bash
pnpm install     # 安装依赖
pnpm dev         # 启动 Playground（http://localhost:5180）
pnpm typecheck   # vue-tsc 类型检查
pnpm build       # 构建 ES + UMD + d.ts + CSS 到 dist/
```

### 目录结构

```
momo-ui/
├── playground/          # 演示站（Vite 入口）
│   ├── main.ts
│   ├── App.vue
│   └── demos/           # basic / form / data / nav / feedback / advanced
├── src/
│   ├── components/      # 每个组件一个目录（.vue + index.ts）
│   ├── hooks/           # useFloating / useClickOutside / useId
│   ├── styles/          # tokens / base / animation
│   ├── utils/           # install / dom / validate / date / scroll-lock
│   └── index.ts         # 聚合导出 + install
├── vite.config.ts       # lib 模式构建
└── tsconfig.build.json
```

## 开发约定

- 组件统一 `defineOptions({ name: 'MomoXxx' })`
- 每个组件目录的 `index.ts` 通过 `withInstall` 包装，并重新导出 props 类型
- 样式一律写在组件内的**非 scoped** `<style lang="scss">`，前缀 `momo-`，仅消费 CSS 变量
- 弹层统一使用 `useFloating` + `Teleport to="body"` + `v-show`
- 新增组件后：在 `src/index.ts` 中导入、加入 `components` 数组并导出

## License

MIT © Momo UI

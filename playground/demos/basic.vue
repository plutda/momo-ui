<script setup lang="ts">
import { ref } from 'vue'
import {
  MomoAvatar,
  MomoBadge,
  MomoButton,
  MomoCard,
  MomoCol,
  MomoDivider,
  MomoEmpty,
  MomoIcon,
  MomoLink,
  MomoRow,
  MomoSpace,
  MomoTag,
  icons,
} from '../../src'

const loading = ref(false)
const iconNames = Object.keys(icons).slice(0, 18)

function fakeLoading() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
  }, 1600)
}
</script>

<template>
  <div>
    <section class="demo-section">
      <h2 class="demo-section__title">按钮 Button</h2>

      <div class="demo-block">
        <span class="demo-label">类型</span>
        <div class="demo-row">
          <MomoButton type="primary">主要按钮</MomoButton>
          <MomoButton type="success">成功按钮</MomoButton>
          <MomoButton type="warning">警告按钮</MomoButton>
          <MomoButton type="danger">危险按钮</MomoButton>
          <MomoButton type="info">信息按钮</MomoButton>
          <MomoButton>默认按钮</MomoButton>
        </div>
      </div>

      <div class="demo-block">
        <span class="demo-label">尺寸 / 朴素 / 圆角</span>
        <div class="demo-row">
          <MomoButton type="primary" size="small">小按钮</MomoButton>
          <MomoButton type="primary">默认</MomoButton>
          <MomoButton type="primary" size="large">大按钮</MomoButton>
          <MomoButton type="primary" plain>朴素按钮</MomoButton>
          <MomoButton type="success" round>圆角按钮</MomoButton>
          <MomoButton type="primary" circle icon="plus" />
        </div>
      </div>

      <div class="demo-block">
        <span class="demo-label">状态</span>
        <div class="demo-row">
          <MomoButton type="primary" icon="upload">带图标</MomoButton>
          <MomoButton type="primary" :loading="loading" @click="fakeLoading">
            {{ loading ? '加载中…' : '点击加载' }}
          </MomoButton>
          <MomoButton disabled>禁用</MomoButton>
          <MomoLink type="primary" icon="arrow-right">Momo 链接</MomoLink>
          <MomoLink type="danger" disabled>禁用链接</MomoLink>
        </div>
      </div>

      <div class="demo-block demo-narrow">
        <span class="demo-label">块级按钮</span>
        <MomoButton type="primary" block>占满一行</MomoButton>
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">图标 Icon</h2>
      <div class="demo-flex">
        <div v-for="name in iconNames" :key="name" class="demo-icon-cell">
          <MomoIcon :name="name" :size="22" />
          <span>{{ name }}</span>
        </div>
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">标签 / 徽标 / 头像</h2>

      <div class="demo-row">
        <MomoTag>默认</MomoTag>
        <MomoTag type="primary">主要</MomoTag>
        <MomoTag type="success">成功</MomoTag>
        <MomoTag type="warning">警告</MomoTag>
        <MomoTag type="danger">危险</MomoTag>
        <MomoTag type="info" effect="dark">深色</MomoTag>
        <MomoTag type="primary" round closable>可关闭</MomoTag>
      </div>

      <div class="demo-row">
        <MomoBadge :value="12">
          <MomoButton size="small">消息</MomoButton>
        </MomoBadge>
        <MomoBadge :value="120" :max="99">
          <MomoButton size="small" type="success">超过 99</MomoButton>
        </MomoBadge>
        <MomoBadge dot type="danger">
          <MomoButton size="small" type="warning">红点</MomoButton>
        </MomoBadge>
      </div>

      <div class="demo-row">
        <MomoAvatar size="large">🐻</MomoAvatar>
        <MomoAvatar>🐱</MomoAvatar>
        <MomoAvatar size="small">🐰</MomoAvatar>
        <MomoAvatar shape="square" icon="user" />
        <MomoAvatar color="var(--momo-color-warning)" size="large">M</MomoAvatar>
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">卡片 / 栅格 / 间距</h2>

      <MomoCard title="Momo 卡片" shadow="hover">
        <p style="margin: 0; font-weight: 600; color: var(--momo-text-regular)">
          软软的、圆圆的、带一点点果冻感的卡片。悬停时会轻轻浮起来哦。
        </p>
      </MomoCard>

      <MomoDivider content-position="left">栅格布局</MomoDivider>

      <MomoRow :gutter="12">
        <MomoCol :span="8"><div class="demo-box">span 8</div></MomoCol>
        <MomoCol :span="8"><div class="demo-box">span 8</div></MomoCol>
        <MomoCol :span="8"><div class="demo-box">span 8</div></MomoCol>
      </MomoRow>

      <MomoDivider dashed>弹性间距</MomoDivider>

      <MomoSpace wrap>
        <MomoTag type="primary">Vue 3</MomoTag>
        <MomoTag type="success">TypeScript</MomoTag>
        <MomoTag type="warning">Vite</MomoTag>
        <MomoTag type="danger">SCSS</MomoTag>
        <MomoTag type="info">Cartoon</MomoTag>
      </MomoSpace>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">空状态 Empty</h2>
      <MomoEmpty description="这里空空如也，去添加点什么吧～" />
    </section>
  </div>
</template>

<style scoped>
.demo-icon-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 76px;
  padding: 10px 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--momo-text-secondary);
  background: var(--momo-bg-soft);
  border: 1.5px solid var(--momo-border-soft);
  border-radius: 12px;
}
</style>

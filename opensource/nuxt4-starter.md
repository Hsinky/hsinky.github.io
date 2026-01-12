---
title: Nuxt 4 企业级脚手架 | 开源项目
description: 基于 Nuxt 4 的高性能全栈开发脚手架，集成自动化工程流、PDF生成、Excel解析等企业级能力。
head:
  - - meta
    - name: keywords
      content: Nuxt 4, Nuxt 4脚手架, 企业级开发, 前端架构, UseFetch封装, PDF生成, Excel解析, 自动化SEO, Pinia状态管理, TailwindCSS

pageClass: project-page
aside: false
---


<div class="project-detail">
  <header class="detail-header">
    <div class="header-deco">OPEN SOURCE 01</div>
    <h1 class="detail-title">Nuxt 4 企业级脚手架</h1>
    <p class="detail-subtitle">High-performance Enterprise Full-stack Boilerplate</p>
  </header>
  <section class="detail-intro">
    <div class="intro-main">
      <div class="intro-content">
        <h2>工程化驱动的高效开发范式</h2>
        <p>这是一个深度集成 <strong>Nuxt 4</strong> 最新特性的全职开发者脚手架。它不仅完成了基础环境的搭建，更将复杂的业务逻辑抽象为标准化的底层能力，旨在让开发者从繁琐的配置中解脱，专注于核心业务的构建。</p>
        <p>本项目不仅是一套代码模版，更是一套关于<strong>“高性能全栈架构”</strong>的实践指南，涵盖了从服务端请求拦截到客户端复杂文件处理的全链路方案。</p>
      </div>
    </div>
  </section>
  <section class="detail-features">
    <div class="feature-grid">
      <div class="feature-item">
        <span class="f-num">01</span>
        <div class="f-info">
          <h3>核心工程封装</h3>
          <p>内置基于 UseFetch 的响应式请求拦截器，完美处理 Token 刷新、全局错误捕获与多种环境下的 BaseURL 动态切换。 </p>
        </div>
      </div>
      <div class="feature-item">
        <span class="f-num">02</span>
        <div class="f-info">
          <h3>文件处理实验室</h3>
          <p>集成前端 PDF 动态生成与预览方案，以及高效的 Excel 异步解析数据流，轻松应对企业级报表与数据交互需求。</p>
        </div>
      </div>
      <div class="feature-item">
        <span class="f-num">03</span>
        <div class="f-info">
          <h3>Nuxt 4 全栈特性</h3>
          <p>深度适配 Nuxt 4 的新版目录结构与模块系统，预设 Pinia 状态管理、TailwindCSS 响应式布局与自动化的 SEO 优化体系。</p>
        </div>
      </div>
    </div>
  </section>
  <footer class="detail-footer" style="flex-direction: column; align-items: center; gap: 30px;">
    <div style="display: flex; gap: 20px;">
      <button @click="showModal = true" class="VPButton brand">快速开始</button>
      <button @click="showModal = true" class="VPButton alt">查看代码库</button>
    </div>
    <p style="font-size: 0.8rem; color: var(--vp-c-text-3); letter-spacing: 0.2em;">版本: 1.0.0-beta | 授权模式: 商业授权</p>
  </footer>
  <!-- 自定义美化弹窗 -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showModal" class="custom-modal-mask" @click.self="showModal = false">
        <div class="custom-modal-container">
          <div class="modal-header">
            <span class="modal-title">致开发者 / TO DEVELOPER</span>
            <button class="modal-close" @click="showModal = false">×</button>
          </div>
          <div class="modal-body">
            <p class="modal-intro">感谢你对 <strong>Nuxt 4 企业级脚手架</strong> 的关注。</p>
            <div class="modal-notice">
              <p>本项目不仅是代码的集合，更是成熟工程经验的封装。为确保你能深度理解架构精髓并获得长期的技术保障，我提供<strong>全链路的顾问式支持</strong>——包括从环境搭建到核心架构的<strong>手把手落地指导</strong>。如需获取完整源码及深度技术支持，请联系作者详谈。</p>
            </div>
            <div class="contact-card">
              <span class="card-label">联系作者 / CONTACT</span>
              <div class="wechat-id">lixinqi-2738</div>
              <p class="card-hint">（微信备注：Nuxt4 开源）</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn" @click="showModal = false">我已了解</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</div>

<script setup>
import { ref } from 'vue'
const showModal = ref(false)
</script>

<style scoped>
/* 按钮基础样式 */
.detail-footer button {
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

/* 弹窗遮罩：磨砂玻璃效果 */
.custom-modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 弹窗主体：延续画报极简风 */
.custom-modal-container {
  width: 90%;
  max-width: 420px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  padding: 40px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.2);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.modal-title {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  line-height: 1;
  padding: 0;
  margin-top: -5px;
}

.modal-body {
  margin-bottom: 35px;
}

.modal-intro {
  font-size: 1.2rem;
  margin-bottom: 25px;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.modal-notice {
  background: var(--vp-c-bg-soft);
  padding: 20px;
  border-left: 2px solid var(--vp-c-text-1);
  margin-bottom: 30px;
}

.modal-notice p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0;
}

.contact-card {
  text-align: center;
  padding: 25px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
}

.card-label {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  letter-spacing: 0.2em;
  display: block;
  margin-bottom: 12px;
}

.wechat-id {
  font-family: var(--vp-font-family-mono);
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.card-hint {
  font-size: 0.8rem;
  color: var(--vp-c-brand);
  margin: 0;
}

.modal-footer {
  text-align: center;
}

.modal-btn {
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  border: none;
  padding: 12px 50px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.modal-btn:hover {
  transform: translateY(-2px);
}

/* 动画：淡入并轻微上浮 */
.fade-enter-active, .fade-leave-active {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
}
</style>

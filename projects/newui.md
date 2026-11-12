---
title: newui - uni-app x 商业组件库 | 李欣琪
description: newui 是为 uni-app x 而生的商业组件库：106 个生产级组件、CSS 变量深浅双主题、中英多语言、零依赖自包含，由李欣琪 (Hsinky Li) 设计与开发。
head:
  - - meta
    - name: keywords
      content: newui, new-ui, uni-app x, uni-app-x, 组件库, UI组件, 商业组件库, 深色模式, 多语言, UTS, HBuilderX, 李欣琪, Hsinky Li
aside: false
pageClass: project-page
---

# newui

<div class="project-detail">
  <header class="detail-header">
    <div class="header-deco">CASE STUDY 03</div>
    <h1 class="detail-title">newui</h1>
    <p class="detail-subtitle">为 uni-app x 而生 · 106 组件 · 深浅双主题 · 零依赖</p>
  </header>

  <section class="detail-intro">
    <div class="intro-main">
      <div class="intro-content">
        <h2>导入即用的一件套</h2>
        <p>newui 是一套面向 uni-app x 的<strong>商业组件库</strong>，覆盖基础、布局、弹层反馈、表单输入、选择器与虚拟键盘六大族共计 106 个生产级组件。组件为 <strong>.uvue 原生形态</strong>，经 easycom 自动注册，模板里直接写 <strong>n-xxx</strong> 标签即可，无需任何导入语句。</p>
        <p>自包含、零构建依赖、适配 App 端原生渲染——从个人项目到商业交付，导入即用，深色模式与中英双语开箱即用。</p>
      </div>
    </div>
  </section>

  <section class="detail-features">
    <div class="feature-grid">
      <div class="feature-item">
        <span class="f-num">01</span>
        <div class="f-info">
          <h3>深色模式开箱即用</h3>
          <p>CSS 变量双主题：跟随系统、手动三态、局部深色域三种粒度，切换即全局生效、零闪烁。设计令牌驱动，改一处全局生效，品牌换肤不动组件代码。</p>
        </div>
      </div>
      <div class="feature-item">
        <span class="f-num">02</span>
        <div class="f-info">
          <h3>原生组件单根</h3>
          <p>按钮的根就是原生 button，文本的根就是原生 text，无包装层，App / Web / 微信小程序各端行为与原生一致。表单、开放能力、无障碍语义天然可用。</p>
        </div>
      </div>
      <div class="feature-item">
        <span class="f-num">03</span>
        <div class="f-info">
          <h3>多语言与零依赖</h3>
          <p>中英双语随库发行，三层回退永不露裸键，运行时可挂载任意新语种。不依赖任何 npm 包，599 个矢量图标 base64 内嵌，离线可用、无 CDN 外链。</p>
        </div>
      </div>
      <div class="feature-item">
        <span class="f-num">04</span>
        <div class="f-info">
          <h3>加密发行，IDE 体验无损</h3>
          <p>源码加密保护版权，组件模板提示（easycom 元数据）与完整类型声明随包明文发行。属性声明与实现漂移即构建报错，双语言包文案键机器校验。</p>
        </div>
      </div>
    </div>
  </section>

  <section class="newui-price">
    <div class="price-card">
      <p class="p-name">Regular</p>
      <p class="p-amount">¥ 8.80</p>
      <p class="p-desc">加密发行版：全组件使用授权 + 持续更新，组件只增不减。</p>
    </div>
    <div class="price-card">
      <p class="p-name">Source Code</p>
      <p class="p-amount">¥ 16.80</p>
      <p class="p-desc">源码版：全部源代码 + 设计令牌底本，可深度定制品牌换肤。</p>
    </div>
  </section>

  <div class="newui-cta">
    <a class="cta-btn cta-main" href="/newui-docs/">查看组件手册 →</a>
    <!-- target 必须：VitePress router 拦截无 target 的站内 a 点击按 md 路由表解析，
         /newui/index.html 不是 md 页面会被渲染成 404；整页跳转/iframe 直接发 HTTP 请求则正常 -->
    <a class="cta-btn cta-ghost" href="/newui/index.html" target="_blank" rel="noopener">在线演示</a>
    <!-- TODO: 替换为 DCloud 插件市场实际购买地址 -->
    <a class="cta-btn cta-ghost" href="#">获取商业授权</a>
  </div>

  <footer class="detail-footer">
    <div class="qr-container">
      <img src="https://i.imgs.ovh/2026/09/14/0404231bc180bb6ed591b2016efc847d.jpg" alt="newui 演示小程序" class="qr-code" />
      <p class="qr-desc">扫码体验 / 演示小程序</p>
    </div>
  </footer>
</div>

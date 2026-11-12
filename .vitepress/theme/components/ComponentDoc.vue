<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  /** 组件目录名，如 n-button */
  name: { type: String, required: true },
  /** 组件中文名，如 按钮 */
  label: { type: String, default: '' },
  /** 演示站 hash 路由（不含 /newui-demo/# 前缀），空串表示无在线演示 */
  demoUrl: { type: String, default: '' },
  /** 是否有示例代码（demo.md 是否存在） */
  hasDemoCode: { type: Boolean, default: false },
})

/* 中栏文档：sync 脚本预渲染的纯 HTML 字符串（.parts/. 点目录不注册为页面）。
 * eager 打包保证 SSR 直出；内容不经 Vue 模板编译，源文档特殊字符全免疫 */
const docModules = import.meta.glob('../../../newui-docs/.parts/*/doc.js', {
  eager: true,
})
const DocHtml = computed(
  () => docModules[`../../../newui-docs/.parts/${props.name}/doc.js`]?.default || ''
)

/* 右栏示例代码：按需懒加载的预渲染 HTML 字符串 */
const demoModules = import.meta.glob('../../../newui-docs/.parts/*/demo.js')
const DemoHtml = ref('')
onMounted(async () => {
  const loader = demoModules[`../../../newui-docs/.parts/${props.name}/demo.js`]
  if (loader) DemoHtml.value = (await loader()).default
})

/* 右栏 tab：预览（iframe，点击激活） / 代码 */
const hasPreview = computed(() => !!props.demoUrl)
const tabs = computed(() => [
  ...(hasPreview.value ? [{ key: 'preview', text: '预览' }] : []),
  ...(props.hasDemoCode ? [{ key: 'code', text: '代码' }] : []),
])
/* 默认落在"预览"，无在线演示的组件退回"代码" */
const tab = ref(hasPreview.value ? 'preview' : 'code')
/* 显式 index.html：Vite dev server 不为 public 目录路径自动提供 index.html
 * （/newui/ 会 404），显式路径 dev 与生产（静态托管）都正常 */
const frameUrl = computed(() => `/newui/index.html#${props.demoUrl}`)
/* 临时校准模式：组件页 URL 加 ?cal 打开，预览区出现滑块实时调 iframe
 * 在壳图内的落位（百分比）/ 圆角（px）。调到严丝合缝后把五个数值
 * 报回来写死进下方 CAL_DEFAULT 与 CSS，然后移除整套校准代码 */
const CAL_DEFAULT = { top: 5.1, left: 3.8, width: 92.4, height: 93.5, radius: 30 }
const cal = ref(null)
const calKeys = [
  { key: 'top', label: '上', min: 0, max: 15, step: 0.1, unit: '%' },
  { key: 'left', label: '左', min: 0, max: 10, step: 0.1, unit: '%' },
  { key: 'width', label: '宽', min: 80, max: 100, step: 0.1, unit: '%' },
  { key: 'height', label: '高', min: 80, max: 100, step: 0.1, unit: '%' },
  { key: 'radius', label: '圆角', min: 0, max: 60, step: 1, unit: 'px' },
]
const calStyle = computed(() =>
  cal.value
    ? {
        top: cal.value.top + '%',
        left: cal.value.left + '%',
        width: cal.value.width + '%',
        height: cal.value.height + '%',
        borderRadius: cal.value.radius + 'px',
      }
    : undefined
)
onMounted(() => {
  if (new URLSearchParams(window.location.search).has('cal')) {
    cal.value = { ...CAL_DEFAULT }
  }
})

const frameLoading = ref(true)
const onFrameLoad = (e) => {
  frameLoading.value = false
  /* 同源 iframe 注入样式：演示站产物页头为浅灰 #F8F8F8（源工程
     theme.json 的 navBgColor），与壳图纯白屏幕不融；覆盖为白。
     暗色模式下保持深色（theme.json dark 的 #171717），不写死白。
     源工程 theme.json 已同步改白，重新发行 H5 后此注入仅作兜底 */
  const doc = e?.target?.contentDocument
  if (!doc || doc.getElementById('cd-nav-override')) return
  const style = doc.createElement('style')
  style.id = 'cd-nav-override'
  style.textContent =
    'uni-page-head,.uni-page-head{background-color:#ffffff !important}' +
    '@media (prefers-color-scheme: dark){' +
    'uni-page-head,.uni-page-head{background-color:#171717 !important}}'
  doc.head?.appendChild(style)
}
</script>

<template>
  <div class="component-doc" :class="{ 'with-aside': tabs.length }">
    <!-- 中栏：组件使用说明 -->
    <article class="cd-doc" v-html="DocHtml"></article>

    <!-- 右栏：示例（预览 / 代码） -->
    <aside v-if="tabs.length" class="cd-aside">
      <div class="cd-tabs">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="cd-tab"
          :class="{ active: tab === t.key }"
          @click="tab = t.key"
        >
          {{ t.text }}
        </button>
        <a
          v-if="hasPreview && tab === 'preview'"
          class="cd-open"
          :href="frameUrl"
          target="_blank"
          rel="noopener"
          >新窗口 ↗</a
        >
      </div>

      <!-- 预览：进页面即加载演示站（窄屏下移出视口时由浏览器延迟） -->
      <div v-show="tab === 'preview'" class="cd-preview">
        <!-- 校准面板（?cal）：拖滑块对齐壳图，数值抄回写死 -->
        <div v-if="cal" class="cd-cal">
          <label v-for="c in calKeys" :key="c.key">
            <span>{{ c.label }}</span>
            <input
              type="range"
              :min="c.min"
              :max="c.max"
              :step="c.step"
              v-model.number="cal[c.key]"
            />
            <b>{{ cal[c.key] }}{{ c.unit }}</b>
          </label>
        </div>
        <div class="cd-device" :class="{ loading: frameLoading }">
          <!-- 壳图用 <img> 铺满：容器高度由图自身比例撑出，
               iframe 的百分比定位恒等于相对图片本身，不再有比例猜测 -->
          <img class="cd-shell" src="/images/iPhone13.png" alt="" aria-hidden="true" />
          <iframe
            :src="frameUrl"
            title="组件在线演示"
            loading="lazy"
            :style="calStyle"
            @load="onFrameLoad"
          />
          <span v-if="frameLoading" class="cd-spin">演示加载中…</span>
        </div>
      </div>

      <!-- 代码：示例代码块 -->
      <div v-show="tab === 'code'" class="cd-code">
        <div v-if="DemoHtml" v-html="DemoHtml"></div>
        <p v-else class="cd-loading">示例代码加载中…</p>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.component-doc {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 40px;
  align-items: start;
}
.component-doc.with-aside {
  grid-template-columns: minmax(0, 1fr) clamp(340px, 30vw, 480px);
}

/* ---------- 右栏 ---------- */
.cd-aside {
  position: sticky;
  top: calc(var(--vp-nav-height) + 20px);
  max-height: calc(100vh - var(--vp-nav-height) - 40px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 4px 0 32px 28px;
  /* 左侧竖线：中栏文档的节分隔线（h2 border-top）止于中栏右缘，
     竖线明确划出「文档区 | 演示区」，分隔线断在竖线处是刻意结构 */
  border-left: 1px solid var(--vp-c-divider);
}

.cd-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
  padding: 4px 0;
}
.cd-tab {
  appearance: none;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  letter-spacing: 0.08em;
  padding: 5px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.25s;
}
.cd-tab:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
}
.cd-tab.active {
  color: var(--vp-c-bg);
  background: var(--vp-c-text-1);
  border-color: var(--vp-c-text-1);
}
.cd-open {
  margin-left: auto;
  font-size: 12px;
  color: var(--vp-c-text-3);
  text-decoration: none;
  letter-spacing: 0.05em;
}
.cd-open:hover {
  color: var(--vp-c-text-1);
}

/* 校准面板（?cal 临时工具）：一行五个滑块 + 实时数值 */
.cd-cal {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-bottom: 10px;
  padding: 8px 10px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.cd-cal label {
  display: flex;
  align-items: center;
  gap: 6px;
}
.cd-cal input[type='range'] {
  width: 90px;
  accent-color: var(--vp-c-brand);
}
.cd-cal b {
  font-family: monospace;
  font-weight: 600;
  color: var(--vp-c-text-1);
  min-width: 52px;
}

/* 预览：手机壳（iPhone13 边框图 + 屏幕区 iframe）
 * 结构：<img> 铺满决定容器形状（图自身比例，无猜测），
 * iframe 绝对定位按壳图实测边框厚度落位：
 * 左右 3.8% / 上 5.1%（状态栏下缘，壳图状态栏画在图里）/ 下 1.4%，
 * 屏幕圆角按壳宽 440px 等比 ≈ 30px */
.cd-device {
  position: relative;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
}
.cd-shell {
  display: block;
  width: 100%;
  height: auto;
}
.cd-device.loading iframe {
  opacity: 0.4;
}
.cd-device iframe {
  position: absolute;
  /* 壳图顶部自带状态栏（时间/信号/电池，0.3in 画在图里）：
     iframe 从状态栏下方的内容区起（75px/1472 ≈ 5.1%），
     露出壳图状态栏，demo 内容从其下方开始 */
  top: 5.1%;
  left: 3.8%;
  /* iframe 是替换元素：width/height auto 解析为固有尺寸 300x150，
     top+bottom / left+right 撑不开（over-constrained 忽略 right/bottom），
     必须显式给尺寸：宽 92.4% = 100% - 左右 3.8%×2，
     高 93.5% = 100% - 上 5.1% - 下 1.4% */
  width: 92.4%;
  height: 93.5%;
  border: 0;
  border-radius: 30px;
  background: var(--vp-c-bg);
}
.cd-spin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 13px;
  color: var(--vp-c-text-3);
  letter-spacing: 0.1em;
}

/* 代码：示例块 */
.cd-code :deep(blockquote) {
  /* demo.md 里的 `> 说明` 是每个示例块的小标题 */
  border: none;
  border-left: 2px solid var(--vp-c-brand);
  background: transparent;
  padding: 0 0 0 10px;
  margin: 18px 0 8px;
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.cd-code :deep(div[class*='language-']) {
  margin: 0 0 8px;
  font-size: 12.5px;
  border-radius: 10px;
}
.cd-code :deep(pre) {
  font-size: 12.5px;
  line-height: 1.7;
}
.cd-loading {
  color: var(--vp-c-text-3);
  font-size: 13px;
  padding: 24px 0;
  text-align: center;
}

/* ---------- 响应式：窄屏右栏下移 ---------- */
@media (max-width: 1279px) {
  .component-doc.with-aside {
    grid-template-columns: minmax(0, 1fr);
  }
  .cd-aside {
    position: static;
    max-height: none;
    overflow: visible;
    border-top: 1px solid var(--vp-c-divider);
    border-left: none;
    padding: 24px 4px 0;
  }
}
</style>

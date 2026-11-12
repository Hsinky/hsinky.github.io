#!/usr/bin/env node
/**
 * new-ui 组件文档同步脚本
 *
 * 从本地 uniappx-ui 工程读取 new-ui 组件库文档，生成到网站 newui-docs/ 目录：
 *   - components/<n-xxx>/index.md  组件页壳（三栏布局入口）
 *   - .parts/<n-xxx>/doc.js        中栏：说明 + 兼容性 + API 表（预渲染 HTML 字符串）
 *   - .parts/<n-xxx>/demo.js       右栏：示例代码（预渲染 HTML 字符串）
 *   - index.md                     手册首页（help.md 去内部路线图）
 *   - changelog/index.md           更新日志
 *   - components.json              组件元数据（供 config.ts 动态生成 sidebar）
 *
 * 中栏 / 右栏内容预渲染为纯 HTML（vitepress 的 createMarkdownRenderer），
 * 前端 v-html 注入：源文档里的泛型尖括号、模板插值 {{ }} 等对 Vue SFC
 * 编译全是雷，预渲染后完全绕开模板编译，任何字符都不会再炸构建。
 * .parts 目录以点开头，VitePress 不会把里面的文件注册为页面。
 *
 * 路径约定：/newui/ 为在线演示站（public/newui/，H5 发行产物，base=/newui/），
 * /newui-docs/ 为本脚本生成的组件手册，两者互不重叠。
 *
 * 用法：pnpm newui:sync
 * 源目录默认 ../uniappx-ui/new-ui/uni_modules/new-ui，可用环境变量 NEW_UI_SRC 覆盖。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createMarkdownRenderer } from 'vitepress'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.resolve(
  ROOT,
  process.env.NEW_UI_SRC || '../uniappx-ui/new-ui/uni_modules/new-ui'
)
const OUT = path.resolve(ROOT, 'newui-docs')

/* ------------------------------------------------------------------ */
/* 工具                                                                */
/* ------------------------------------------------------------------ */

const readIfExists = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : null)

const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, content)
}

/** YAML 双引号标量安全化：值内的 `: `、`#`、引号、换行都会破坏未加引号的 frontmatter */
const yamlQuote = (s) =>
  '"' +
  String(s)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, ' ') +
  '"'

/** HTML 属性值转义（用于生成的 md 里内嵌组件的 props） */
const htmlAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')

/** 代码块与行内 code 外的裸 `<xxx` 序列转义为 &lt;。
 *  markdown 会把正文里的 `<xxx>` 当行内 html 原样透传成真实元素，
 *  文档表格里的泛型（Map<string, Foo[]>、Array<NFormError>）会被浏览器
 *  渲染成空的自定义标签导致文字消失；转义后显示为字面量文本。 */
const escapeRawAngle = (lines) => {
  let inFence = false
  return lines.map((line) => {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      return line
    }
    if (inFence) return line
    // 行内 code span（`...`）内的内容不动，markdown-it 自会安全输出
    return line
      .split(/(`[^`]*`)/g)
      .map((seg) =>
        seg.startsWith('`') ? seg : seg.replace(/<(?=[a-zA-Z!/])/g, '&lt;')
      )
      .join('')
  })
}

/** 行内 markdown 标记清理（反引号 / 链接 / 加粗），用于提取纯文本摘要 */
const stripInline = (s) =>
  s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .trim()

/* ------------------------------------------------------------------ */
/* 解析 help.md：组件分类矩阵                                           */
/* ------------------------------------------------------------------ */

/** 从 help.md 组件矩阵章节提取 { categoryName: [n-xxx, ...] }（保持出现顺序） */
function parseCategories(helpLines) {
  const categories = new Map() // name -> category
  const order = [] // 分类顺序
  let current = null
  for (const line of helpLines) {
    if (line.startsWith('### ')) {
      const text = line
        .replace(/^###\s*/, '')
        .replace(/^[^a-zA-Z一-龥]+/, '')
        .trim()
      current = text || null
      if (current && !order.includes(current)) order.push(current)
    } else if (current && /^\|\s*\*\*(n-[a-z0-9-]+)\*\*\s*\|/.test(line)) {
      const m = line.match(/^\|\s*\*\*(n-[a-z0-9-]+)\*\*\s*\|([^|]*)\|/)
      if (m && !categories.has(m[1])) categories.set(m[1], current)
    }
  }
  return { categories, order }
}

/* ------------------------------------------------------------------ */
/* 解析 pages.json：演示页兜底映射                                      */
/* ------------------------------------------------------------------ */

/** shortName(组件名去 n- 前缀) -> 演示页绝对路径，如 button -> /pkgBasic/newui/button */
function parseDemoPages() {
  const raw = readIfExists(path.resolve(SRC, '../pages.json'))
  const map = new Map()
  if (!raw) return map
  // pages.json 带注释，先粗剥 // 注释再 JSON.parse
  const json = raw.replace(/^\s*\/\/.*$/gm, '')
  try {
    const data = JSON.parse(json)
    for (const pkg of data.subPackages || []) {
      for (const page of pkg.pages || []) {
        const short = (page.path || '').split('/').pop()
        if (short) map.set(short, `/${pkg.root}/${page.path}`)
      }
    }
  } catch {
    /* 解析失败不影响主流程，仅失去兜底 */
  }
  return map
}

/* ------------------------------------------------------------------ */
/* 解析单个组件 readme                                                  */
/* ------------------------------------------------------------------ */

function parseReadme(name, raw, demoPageMap) {
  let lines = raw.split(/\r?\n/)

  // 1. 剥 frontmatter
  if (lines[0]?.trim() === '---') {
    const end = lines.indexOf('---', 1)
    if (end > 0) lines = lines.slice(end + 1)
  }

  // 2. 定位 ::: doc 与 ::: demo 容器。
  //    readme 有两种形态：带 ::: doc 容器；裸 markdown（无任何容器标记）。
  //    裸文档形态以全量为文档主体（截到 ::: demo 为止），不因缺容器而跳过。
  const idxDoc = lines.findIndex((l) => l.trim() === '::: doc')
  const idxDemoContainer = lines.findIndex((l) => l.trim() === '::: demo')

  let docLines =
    idxDoc >= 0
      ? idxDemoContainer > idxDoc
        ? lines.slice(idxDoc + 1, idxDemoContainer)
        : lines.slice(idxDoc + 1)
      : idxDemoContainer >= 0
        ? lines.slice(0, idxDemoContainer)
        : lines.slice()

  // 3. 去掉 doc 容器闭合的 `:::`（自尾部找第一个非空行，若是 ::: 则剔除）
  for (let i = docLines.length - 1; i >= 0; i--) {
    if (docLines[i].trim() === '') continue
    if (docLines[i].trim() === ':::') docLines.splice(i)
    break
  }

  // 4. 提取 demo url（readme 内 <demo url="..."/> 优先，pages.json 兜底）
  let demoUrl = ''
  if (idxDemoContainer >= 0) {
    const m = lines
      .slice(idxDemoContainer)
      .join('\n')
      .match(/<demo[^>]*\burl="([^"]+)"/)
    if (m) demoUrl = m[1]
  }
  if (!demoUrl) demoUrl = demoPageMap.get(name.replace(/^n-/, '')) || ''
  if (demoUrl && !demoUrl.startsWith('/')) demoUrl = '/' + demoUrl

  // 5. 按 `## 示例代码` / `## API` 切分中栏与右栏内容
  const iDemoSection = docLines.findIndex((l) => l.startsWith('## 示例代码'))
  const iApi = docLines.findIndex((l) => l.startsWith('## API'))
  let docPart
  let demoPart = []
  if (iDemoSection >= 0) {
    const demoEnd = iApi > iDemoSection ? iApi : docLines.length
    demoPart = docLines.slice(iDemoSection + 1, demoEnd)
    docPart = [
      ...docLines.slice(0, iDemoSection),
      ...(iApi > iDemoSection ? docLines.slice(iApi) : []),
    ]
  } else {
    docPart = docLines
  }

  // 6. h1 标题 -> 组件中文名
  const h1 = docPart.find((l) => l.startsWith('# '))
  let label = name
  if (h1) {
    const title = h1.replace(/^#\s*/, '').trim()
    const segs = title.split(/\s+/)
    if (segs[0] === name && segs.length > 1) label = segs.slice(1).join(' ')
    else if (segs.length > 1) label = segs.slice(1).join(' ')
  }

  // 7. 摘要：h1 后第一段正文
  let desc = ''
  const bodyStart = docPart.findIndex((l) => l.startsWith('# '))
  for (const line of docPart.slice(bodyStart + 1)) {
    const t = line.trim()
    if (!t || t.startsWith('>') || t.startsWith('|') || t.startsWith('#')) continue
    if (t === ':::') continue
    desc = stripInline(t)
    break
  }
  if (desc.length > 90) desc = desc.slice(0, 90) + '…'

  // 8. 代码块外的裸 < 转义（见 escapeRawAngle 注释），doc 与 demo 两栏统一处理
  docPart = escapeRawAngle(docPart)
  demoPart = escapeRawAngle(demoPart)
  // 注：中栏 / 右栏最终预渲染为纯 HTML（v-html 注入），不走 Vue 模板编译；
  // 这里转义只为避免 markdown 把泛型尖括号透传成真实 html 元素。

  return { name, label, demoUrl, docPart, demoPart, desc }
}

/* ------------------------------------------------------------------ */
/* 生成                                                                */
/* ------------------------------------------------------------------ */

function renderComponent(comp, md) {
  const dir = path.join(OUT, 'components', comp.name)
  const partsDir = path.join(OUT, '.parts', comp.name)
  // 中栏 / 右栏预渲染为纯 HTML 字符串模块（.js），前端 v-html 注入
  write(
    path.join(partsDir, 'doc.js'),
    `export default ${JSON.stringify(md.render(comp.docPart.join('\n').trim() + '\n'))}\n`
  )
  if (comp.demoPart.length) {
    write(
      path.join(partsDir, 'demo.js'),
      `export default ${JSON.stringify(md.render(comp.demoPart.join('\n').trim() + '\n'))}\n`
    )
  }
  const hasDemoCode = comp.demoPart.length ? 'true' : 'false'
  write(
    path.join(dir, 'index.md'),
    `---
title: ${yamlQuote(`${comp.label} ${comp.name} · newui 组件文档`)}
description: ${yamlQuote(comp.desc || `${comp.label}（${comp.name}）组件使用说明与 API`)}
aside: false
pageClass: newui-doc
---

<ComponentDoc name="${htmlAttr(comp.name)}" label="${htmlAttr(comp.label)}" demo-url="${htmlAttr(comp.demoUrl)}" :has-demo-code="${hasDemoCode}" />
`
  )
}

function renderHome(helpRaw, count) {
  const lines = helpRaw.split(/\r?\n/)
  // 剔除「组件路线图」章节（内部开发规划，不对外）
  const iRoadmap = lines.findIndex((l) => l.startsWith('## ') && l.includes('组件路线图'))
  let out = lines
  if (iRoadmap >= 0) {
    const iNext = lines.findIndex((l, i) => i > iRoadmap && l.startsWith('## '))
    out = [
      ...lines.slice(0, iRoadmap),
      ...(iNext > 0 ? lines.slice(iNext) : []),
    ]
  }
  // 源 help.md 矩阵标题的组件数靠人手维护（已多次滞后：写 84 时实际 106），
  // 渲染时一律重写为实际扫描到的组件目录数；矩阵表格行数仍随源库维护
  const body = escapeRawAngle(out)
    .join('\n')
    .trim()
    .replace(/(组件矩阵（)\d+( 个）)/, `$1${count}$2`)
  write(
    path.join(OUT, 'index.md'),
    `---
title: newui 组件手册 · uni-app x 商业组件库
description: newui 组件库官方文档：快速上手、主题与多语言机制、${count} 个组件使用说明与 API。
outline: [2, 3]
---

${body}
`
  )
}

function renderChangelog(raw) {
  // 源文件若自带 frontmatter，剥掉避免与本页 frontmatter 嵌套破坏 YAML 解析
  let body = raw
  if (raw.trimStart().startsWith('---')) {
    const m = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)
    if (m) body = raw.slice(m[0].length)
  }
  write(
    path.join(OUT, 'changelog', 'index.md'),
    `---
title: 更新日志 · newui 组件文档
description: newui 组件库版本更新日志。
aside: false
---

${escapeRawAngle(body.split(/\r?\n/)).join('\n').trim()}
`
  )
}

/* ------------------------------------------------------------------ */
/* 主流程                                                              */
/* ------------------------------------------------------------------ */

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`[newui:sync] 源目录不存在：${SRC}\n可通过环境变量 NEW_UI_SRC 指定。`)
    process.exit(1)
  }

  // 整体重建输出目录：清掉历史版本的 doc.md / demo.md 等页面碎片，
  // 残留文件仍会被 VitePress 当页面编译，可能报错
  fs.rmSync(OUT, { recursive: true, force: true })

  // 复用 VitePress 的 markdown 渲染器，与站点本身的 md 渲染规则一致
  const md = await createMarkdownRenderer(ROOT)

  const helpRaw = readIfExists(path.join(SRC, 'help.md')) || ''
  const { categories, order } = parseCategories(helpRaw.split(/\r?\n/))
  const demoPageMap = parseDemoPages()

  // 遍历组件目录
  const compDir = path.join(SRC, 'components')
  const names = fs
    .readdirSync(compDir)
    .filter((d) => fs.existsSync(path.join(compDir, d, 'readme.md')))

  const components = []
  for (const name of names) {
    const raw = fs.readFileSync(path.join(compDir, name, 'readme.md'), 'utf-8')
    const comp = parseReadme(name, raw, demoPageMap)
    if (!comp) {
      console.warn(`[newui:sync] ⚠️ ${name} 未找到 ::: doc 容器，跳过`)
      continue
    }
    renderComponent(comp, md)
    components.push({
      name: comp.name,
      label: comp.label,
      desc: comp.desc,
      category: categories.get(comp.name) || '其他',
      demoUrl: comp.demoUrl,
      hasDemoCode: comp.demoPart.length > 0,
    })
  }

  // 侧栏排序：按 help.md 分类顺序，组内按目录名稳定排序
  const catOrder = (c) => {
    const i = order.indexOf(c)
    return i >= 0 ? i : order.length + 1
  }
  components.sort(
    (a, b) => catOrder(a.category) - catOrder(b.category) || a.name.localeCompare(b.name)
  )

  if (helpRaw) {
    renderHome(helpRaw, components.length)
    // help.md 组件矩阵行数与实际组件目录数的偏差提醒
    // （标题数字已自动重写，但矩阵表格行需在源库 help.md 补齐）
    const seg = helpRaw.match(/##[^\n]*组件矩阵[\s\S]*?(?=\n## )/)
    const rows = seg ? (seg[0].match(/^\|\s*\*\*n-[a-z0-9-]+/gm) || []).length : 0
    if (rows && rows !== components.length) {
      console.warn(
        `[newui:sync] ⚠️ help.md 组件矩阵 ${rows} 行，实际组件目录 ${components.length} 个，` +
          `源库 help.md 矩阵待补 ${components.length - rows} 行`
      )
    }
  }
  const changelogRaw = readIfExists(path.join(SRC, 'changelog.md'))
  if (changelogRaw) renderChangelog(changelogRaw)

  write(
    path.join(OUT, 'components.json'),
    JSON.stringify(
      { generatedAt: new Date().toISOString(), count: components.length, components },
      null,
      2
    )
  )

  const withDemo = components.filter((c) => c.demoUrl).length
  const withCode = components.filter((c) => c.hasDemoCode).length
  const cats = [...new Set(components.map((c) => c.category))]
  console.log(
    `[newui:sync] 完成：${components.length} 个组件 / ${cats.length} 个分类` +
      `（${withDemo} 个带在线演示，${withCode} 个带示例代码）`
  )
}

main()

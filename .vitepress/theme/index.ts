// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ComponentDoc from './components/ComponentDoc.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h('div', { class: 'custom-hero-right' }, [
        h('div', { class: 'vertical-slogan' }, [
          h('span', '青灯为墙'),
          h('span', '旖旎为家'),
          h('span', '以梦为马'),
          h('span', '不负韶华'),
        ]),
        h('div', { class: 'hero-deco-text' }, new Date().getFullYear().toString())
      ]),
      'home-features-after': () => h('div', { class: 'site-main' }, [
        h('section', { class: 'project-wrap' }, [
          h('div', { class: 'project-header' }, [
            h('span', { class: 'header-label' }, 'INDEPENDENT PRODUCTS'),
            h('h2', { class: 'header-title' }, '独立产品')
          ]),
          h('div', { class: 'project-list' }, [
            { id: '01', name: '汉邦人', summary: '发现、发扬、传承传统汉文化，与子同袍，与子同行', link: '/projects/hanbangren' },
            { id: '02', name: '路呼', summary: '路就在脚下，吃喝玩乐和好朋友都在这里', link: '/projects/luhu' },
            { id: '03', name: 'newui 组件库', summary: '为 uni-app x 而生的商业组件库：106 组件、深浅双主题、多语言、零依赖', link: '/projects/newui' }
          ].map(p => h('div', { class: 'project-item', onClick: () => window.location.href = p.link }, [
            h('div', { class: 'p-left' }, [
              h('span', { class: 'p-num' }, p.id),
              h('div', { class: 'p-content' }, [
                h('h3', { class: 'p-name' }, p.name),
                h('p', { class: 'p-summary' }, p.summary)
              ])
            ]),
            h('div', { class: 'p-action' }, [
              h('span', { class: 'p-arrow' }, '→')
            ])
          ]))),
          h('div', { class: 'project-footer' }, [
            h('a', { class: 'more-link', href: '/projects/' }, [
              h('span', '查看更多')
            ])
          ])
        ])
      ])
    })
  },
  enhanceApp({ app }) {
    // newui 组件手册三栏布局组件（组件页 md 壳中直接使用）
    app.component('ComponentDoc', ComponentDoc)
  }
} satisfies Theme

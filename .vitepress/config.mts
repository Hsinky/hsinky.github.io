import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "李欣琪",
  description: "青灯为墙，旖旎为家，以梦为马，不负韶华。",
  sitemap: {
    hostname: "https://hsinky.cn",
  },
  head: [
    ["link", { rel: "icon", href: "/images/logo.png" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Outfit:wght@100..300&family=Noto+Serif+SC:wght@200;300;500&display=swap",
      },
    ],
    ["meta", { name: "author", content: "李欣琪" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh_CN" }],
    ["meta", { property: "og:site_name", content: "李欣琪" }],
    ["meta", { property: "og:title", content: "李欣琪 (Hsinky Li) - 记录 · 思考 · 创作" }],
    [
      "meta",
      {
        property: "og:description",
        content: "记录 · 思考 · 创作 - 李欣琪的个人博客",
      },
    ],
    ["meta", { property: "og:url", content: "https://hsinky.cn" }],
    // 百度自动推送脚本
    [
      "script",
      {},
      `(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();`,
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "产品", link: "/projects/", activeMatch: "^/projects/" },
      { text: "开源", link: "/opensource/", activeMatch: "^/opensource/" },
      { text: "关于", link: "/about" },
    ],

    sidebar: {
      "/projects/": [
        {
          text: "独立产品",
          link: "/projects/",
          items: [
            { text: "汉邦人", link: "/projects/hanbangren" },
            { text: "路呼", link: "/projects/luhu" },
          ],
        },
      ],
      "/opensource/": [
        {
          text: "开源项目",
          link: "/opensource/",
          items: [
            { text: "Nuxt 4 企业级脚手架", link: "/opensource/nuxt4-starter" },
          ],
        },
      ],
      "/about": [
        {
          text: "关于我",
          link: "/about",
          items: [
            { text: "个人简介", link: "/about" },
            { text: "核心领域", link: "/about#expertise" },
            { text: "历程经历", link: "/about#experience" },
            { text: "设计哲学", link: "/about#philosophy" },
            { text: "联络方式", link: "/about#contact" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],

    // search: {
    //   provider: "local",
    //   options: {
    //     // 添加调试渲染函数
    //     async _render(src, env, md) {
    //       console.log("🔍 Indexing file:", env.relativePath);
    //       const html = await md.renderAsync(src, env);
    //       console.log("🔍 Frontmatter search:", env.frontmatter?.search);
    //       if (env.frontmatter?.search === false) {
    //         console.log("🔍 Skipping file due to search: false");
    //         return "";
    //       }
    //       console.log("🔍 HTML length:", html.length);
    //       return html;
    //     },
    //   },
    // },

    outline: {
      label: "页面大纲",
    },

    sidebarMenuLabel: "菜单",
    returnToTopLabel: "回到顶部",
    darkModeSwitchLabel: "主题颜色",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",

    docFooter: {
      prev: "←",
      next: "→",
    },
    footer: {
      message: "记录 · 思考 · 创作",
      copyright: "Copyright © 2026-present 李欣琪 (Hsinky Li)",
    },
  },
});

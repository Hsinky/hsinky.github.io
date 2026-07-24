import { defineConfig } from "vitepress";

const SITE_URL = "https://www.hsinky.cn";
const PERSON_URL = `${SITE_URL}/about.html`;

// 全站 WebSite 结构化数据（JSON-LD），帮助搜索引擎与 AI 理解站点实体
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "李欣琪",
  alternateName: "Hsinky Li",
  url: `${SITE_URL}/`,
  description:
    "李欣琪 (Hsinky Li) 的个人博客，分享软件工程、产品设计、开源项目与创作思考。",
  inLanguage: "zh-CN",
};

// 作者 / 站长 Person 结构化数据，让 AI 将"李欣琪"识别为可引用的身份实体
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "李欣琪",
  alternateName: "Hsinky Li",
  url: PERSON_URL,
  jobTitle: "全栈工程师 / 产品设计师",
  sameAs: ["https://github.com/hsinky"],
  knowsAbout: [
    "全栈开发",
    "产品设计",
    "UI/UX 设计",
    "独立开发",
    "汉服与非遗文化",
  ],
};

// 产品页 SoftwareApplication 结构化数据
const productSchemas: Record<string, object> = {
  "projects/hanbangren.md": {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "汉邦人",
    description:
      "专注汉服文化、非遗传承与国风生活的数字化社区，致力于传播中国传统文化与东方美学。",
    url: `${SITE_URL}/projects/hanbangren.html`,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    author: { "@type": "Person", name: "李欣琪", url: PERSON_URL },
  },
  "projects/luhu.md": {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "路呼",
    description:
      "专注城市深度探索与社交的应用，支持 City Walk 路线分享、小众景点打卡与探店指南。",
    url: `${SITE_URL}/projects/luhu.html`,
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    author: { "@type": "Person", name: "李欣琪", url: PERSON_URL },
  },
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-CN",
  title: "李欣琪",
  description: "青灯为墙，旖旎为家，以梦为马，不负韶华。",
  sitemap: {
    hostname: "https://www.hsinky.cn",
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
    [
      "meta",
      {
        property: "og:title",
        content: "李欣琪 (Hsinky Li) - 记录 · 思考 · 创作",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content: "记录 · 思考 · 创作 - 李欣琪的个人博客",
      },
    ],
    ["meta", { property: "og:url", content: "https://www.hsinky.cn" }],
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
    // 全站 WebSite 结构化数据（JSON-LD）
    [
      "script",
      { type: "application/ld+json" },
      JSON.stringify(websiteSchema),
    ],
  ],
  // 为每页生成 canonical 规范网址，统一主机为 www.hsinky.cn
  // 避免搜索引擎因 www / 非 www 不一致判定重复内容而不予收录
  transformPageData(pageData) {
    const path = pageData.relativePath
      .replace(/\.md$/, "")
      .replace(/\\/g, "/");
    const canonical =
      path === "index"
        ? `${SITE_URL}/`
        : path.endsWith("/index")
          ? `${SITE_URL}/${path.slice(0, -6)}/`
          : `${SITE_URL}/${path}.html`;

    const head: any[] = [["link", { rel: "canonical", href: canonical }]];

    // 首页与关于页注入作者 Person 实体
    if (path === "index" || path === "about") {
      head.push([
        "script",
        { type: "application/ld+json" },
        JSON.stringify(personSchema),
      ]);
    }

    // 产品页注入 SoftwareApplication 实体
    const product = productSchemas[pageData.relativePath];
    if (product) {
      head.push([
        "script",
        { type: "application/ld+json" },
        JSON.stringify(product),
      ]);
    }

    return {
      frontmatter: {
        ...pageData.frontmatter,
        head: [...(pageData.frontmatter.head ?? []), ...head],
      },
    };
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "产品", link: "/projects/", activeMatch: "^/projects/" },
      { text: "开源", link: "/opensource/", activeMatch: "^/opensource/" },
      {
        text: "AI",
        items: [
          { text: "资源中心", link: "https://ai.hsinky.cn" },
          { text: "工具", link: "/ai/", activeMatch: "^/ai/" },
        ],
      },
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
      "/ai": [
        {
          text: "AI",
          link: "/ai/",
          items: [{ text: "AI工具", link: "/ai/index" }],
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

    socialLinks: [{ icon: "github", link: "https://github.com/hsinky" }],

    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },

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

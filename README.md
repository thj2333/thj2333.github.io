# 地球 616 · thj2333 的个人主页

一个「美漫刊物」风格的个人站：新闻纸底、平涂油墨、粗描边、BEN-DAY 网点、分格排版，深色 HUD 面板做科技感切角。用来放技术博客与自用小工具。

- 主页 `/` — 封面：本期企划 + 目录 + 最近三期 + 工具柜 + 人物档案
- `/archive` — 全部刊期（文章列表）
- `/archive/<slug>` — 单篇文章，带本期内页目录
- `/armory` — 工具柜，按「运行中 / 测试中 / 已归档」分组
- `/dossier` — 人物档案（神盾局人事档案卡）
- `/rss.xml` — RSS 订阅
- `/404` — 宇宙分支不存在

## 技术栈

- [Astro 5](https://astro.build) — 静态生成，零客户端 JS（除图表类扩展）
- Tailwind CSS v4（经由 `@tailwindcss/vite`）+ 手写印刷体例 CSS
- 字体自托管：Anton（标题）、JetBrains Mono（HUD 数据）；中文用系统 PingFang / 苹方 / Noto Sans SC
- 内容：Astro Content Collections（Markdown + zod schema）

## 命令

```bash
npm install      # 安装依赖
npm run dev      # 开发预览 http://localhost:4321
npm run build    # 产出静态站点到 dist/
npm run preview  # 预览构建结果
```

## 写一篇新文章

在 `src/content/blog/` 新建 `.md`，文件名的英文 slug 就是 URL：

```yaml
---
title: "文章标题"
date: 2026-11-14
category: "CVNote"      # 会显示成角标
excerpt: "列表页与封面用的一句话摘要。"
issue: 7                # 期号，决定排序与 ISSUE #007 的显示
tags: ["NeRF", "笔记"]
draft: false            # true 则不参与构建
---
```

期号 `issue` 是唯一的排序依据（越大越新），新增文章时记得往上加。

## 改内容

| 想改什么 | 改哪里 |
| --- | --- |
| 站点名、刊号、价格、导航 | `src/components/Masthead.astro` |
| 页脚、条码、版权 | `src/components/SiteFooter.astro` |
| 首页文案与版面 | `src/pages/index.astro` |
| 工具清单 | `src/data/tools.ts` |
| 关于页与能力条 | `src/pages/dossier/index.astro` |
| SEO / OG / 字体引入 | `src/layouts/Base.astro`、`src/styles/global.css` |

## 改视觉

所有颜色、字体都集中在 `src/styles/global.css` 顶部的 `@theme` 里：

```css
--color-paper: #efe6d0;   /* 新闻纸 */
--color-ink: #14110e;     /* 油墨黑 */
--color-hero: #e0242a;    /* 漫威红 */
--color-reactor: #f2a900; /* 反应堆金 */
--color-cape: #1e3a6e;    /* 披风蓝 */
--color-hud: #23e0ff;     /* HUD 青 */
```

改这几个值，全站配色跟着变。网点、描边、贴纸、气球这些印刷元件都是下面的工具类：`.halftone` `.panel` `.panel-dark` `.balloon` `.caption` `.sticker` `.crop-marks`。

## 部署到 GitHub Pages

仓库已带 `.github/workflows/deploy.yml`（`withastro/action` + `deploy-pages`）。

1. 推到一个新仓库，或在现有的 `thj2333.github.io` 仓库里替换内容
2. 仓库 Settings → Pages → Source 选 **GitHub Actions**
3. 推到 `main` 分支即自动构建部署

> 注意：`astro.config.mjs` 里的 `site` 已设为 `https://thj2333.github.io`。若部署到子路径（如 `/blog`），需同时设置 `base: "/blog"` 并同步修改站内绝对链接。

## 旧站迁移

原来的 `thj2333.github.io` 仓库里只有 Hexo 生成的静态产物（`public/`），没有源码。已按旧站 6 篇文章的标题与日期预填了 Markdown 占位，正文需要从旧 HTML 里取回或重写。

# 地球 616 · thj2333 的个人主页

一个「美漫刊物」风格的个人站：新闻纸底、平涂油墨、粗描边、BEN-DAY 网点、分格排版，深色 HUD 面板做科技切角。

## 页面

| 路由 | 内容 |
| --- | --- |
| `/` | 封面：本期企划 + 终端目录 + 最新博客 + 工具柜速览 + 六颗宝石 |
| `/archive` | **多元宇宙地图**：616 主宇宙 / 199999 MCU / 838 光照会 / 10005 X 战警，四套地图版式与 18 处地标 |
| `/blog` | 博客列表（4 期：AI 工具全景、MCU 时间线、英雄名册、改版公告） |
| `/blog/<slug>` | 单篇博客，带本期内页目录与上下期 |
| `/armory` | 工具柜：智能助手 / 无限宝石 / 3D 生成工具（占位，未实现） |
| `/dossier` | ~~人物档案~~ 已下线 |
| `/blog/mcu-timeline` | MCU 40 部电影 + 23 部剧集年表（数据驱动，通栏排版） |
| `/blog/mcu-roster` | 22 位英雄 + 57 部非 MCU 别册 |
| `/blog/ai-tools` | AI 工具清单，标记「持续更新」 |
| `/rss.xml` | RSS |
| `/404` | 宇宙分支不存在 |

## 技术栈

- [Astro 5](https://astro.build) — 静态生成，无客户端 JS
- Tailwind CSS v4（`@tailwindcss/vite`）+ 手写印刷体例 CSS
- 字体自托管：Anton（标题）、JetBrains Mono（HUD 数据）；中文走系统 PingFang / Noto Sans SC
- 内容：Astro Content Collections（Markdown + zod schema）

## 命令

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 输出到 dist/
npm run preview  # 预览构建结果
```

## 数据在哪

| 想改什么 | 改哪里 |
| --- | --- |
| MCU 电影年表 / 剧集 / 英雄名册 | `src/data/mcu.ts` |
| 非 MCU 别册（福克斯、索尼、早期单片、旧剧集） | `src/data/legacy.ts` |
| 多元宇宙地图（宇宙、地标坐标、主题） | `src/data/multiverse.ts` |
| 智能助手 / 无限宝石 / 3D 工具 | `src/data/tools.ts` |
| 博客文章 | `src/content/blog/*.md` |
| 站点名、刊号、导航 | `src/components/Masthead.astro` |
| 页脚 | `src/components/SiteFooter.astro` |
| 首页版面 | `src/pages/index.astro` |
| 配色与印刷元件 | `src/styles/global.css` |

电影、剧集与英雄都是纯数据，加一条就往里追一条，页面自动渲染。电影在 `films`，剧集在 `series`（`kind` 分真人/动画/特辑），英雄卡的颜色来自 `accent` 字段。非 MCU 作品按组放在 `legacy.ts` 的 `legacyGroups` 里，每组自带厂牌、色标与说明。

## 写一篇博客

`src/content/blog/` 下新建 `.md`（纯文字）或 `.mdx`（要嵌组件），文件名即 URL：

```yaml
---
title: "标题"
date: 2026-11-15
category: "笔记"
excerpt: "列表页用的一句话摘要。"
issue: 3        # 期号，决定排序与 ISSUE #003
tags: ["NeRF"]
draft: false    # true 则不上线
updated: false  # true 会在卡片和文章头挂「持续更新」角标
wide: false     # true 则通栏，数据密集的文章用
---
```

数据类文章不手抄表格，直接引组件：

```mdx
import McuTimeline from "../../components/McuTimeline.astro";

<McuTimeline />
```

这样 `mcu.ts` / `legacy.ts` 改一处，文章自动跟着变。

## 改视觉

颜色集中在 `src/styles/global.css` 的 `@theme`：

```css
--color-paper: #efe6d0;   /* 新闻纸 */
--color-ink: #14110e;     /* 油墨黑 */
--color-hero: #e0242a;    /* 漫威红 */
--color-reactor: #f2a900; /* 反应堆金 */
--color-cape: #1e3a6e;    /* 披风蓝 */
--color-hud: #23e0ff;     /* HUD 青 */
```

> 组件类（`.panel` `.balloon` `.caption` 等）都在 `@layer components` 里，所以 Tailwind 的 `bg-*` / `text-*` 工具类可以正常覆盖它们。别把这些类挪出图层，否则会盖掉工具类。

## 多元宇宙地图

`/archive` 是地图页，每个宇宙一套**版式主题**（不是同一张图换色）：

| 宇宙 | 主题 | 视觉 |
| --- | --- | --- |
| Earth-616 主宇宙 | `tactical` | 深蓝战术网格 + 扫描光圈，军事 HUD |
| Earth-199999 MCU | `orbital` | 轨道视角、星空、地球弧线 |
| Earth-838 光照会 | `blueprint` | 米白蓝图、细线雷达环、金色强调环 |
| Earth-10005 X 战警 | `atlas` | 泛黄手绘图、等高线、罗盘刻度 |

加一个宇宙 = 往 `src/data/multiverse.ts` 的 `universes` 里加一条（`theme` 选上面四个之一，`landmarks` 里的 `x`/`y` 是地图内百分比坐标）。标签页是纯 CSS 的 radio 切换，没有 JS。

## 旧笔记备份

原来的 6 篇技术笔记（NeRF、3D 分割、3D AIGC、计组复习等）已从站点移除，**本地备份在 `_backup/notes/`**，该目录已加入 `.gitignore`，不会上传。想恢复某篇，把文件挪回 `src/content/blog/` 并补一个 `issue` 号即可。

## 部署到 GitHub Pages

仓库带 `.github/workflows/deploy.yml`（`withastro/action` + `deploy-pages`）。

1. 推到仓库，Settings → Pages → Source 选 **GitHub Actions**
2. 推到 `main` 自动构建

`astro.config.mjs` 的 `site` 已设为 `https://thj2333.github.io`。若部署到子路径，需同时设 `base` 并改站内绝对链接。

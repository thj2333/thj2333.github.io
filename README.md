# 地球 616 · thj2333 的个人主页

一个「美漫刊物」风格的个人站：新闻纸底、平涂油墨、粗描边、BEN-DAY 网点、分格排版，深色 HUD 面板做科技切角。

站点分四块：

- **`/`** 封面 —— 本期企划、最新博客、工具柜速览
- **`/archive`** 多元宇宙地图 —— 616 主宇宙 / 199999 MCU / 838 光照会 / 10005 X 战警，四套地图版式、18 处地标
- **`/blog`** 博客 —— 六个分类分区，分类与文章都能拖动排序
- **`/armory`** 工具柜 —— 智能助手（Jarvis，含手册）、无限宝石、3D 生成工具

技术栈：Astro 5 静态生成 + Tailwind v4 + 手写印刷体例 CSS，字体自托管，内容走 Content Collections（Markdown + zod）。

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 输出 dist/
```

## Jarvis 助手

站点的写作、发布、版本管理都交给 **Jarvis**——一个独立的本地应用，不在本仓库内：

```
~/Desktop/Code/jarvis      # macOS 应用 + Node 服务
```

| 功能 | 作用 |
| --- | --- |
| 编辑器 | 文件树 + 站点实时预览；点击定位源码；可切换编辑/浏览模式 |
| 发布 | 构建校验 → 提交 → 推送，交给 GitHub Actions 上线 |
| 同步 | 登记任意本地 git 仓库，设远端、拉取（`--ff-only`）、推送 |
| 应用 | 记录 .app 与源码路径，一键重新打包，版本可回退 |

启动：双击 `Jarvis.app`，或 `cd ../jarvis && npm start`。

工具柜里展示的手册就是 `src/content/docs/jarvis-*.md`，页面由 `src/pages/armory/index.astro` 读取渲染。

详细用法见 `jarvis/README.md`。

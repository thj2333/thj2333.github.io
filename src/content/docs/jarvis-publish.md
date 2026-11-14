---
title: "发布到 GitHub"
tool: "Jarvis"
summary: "Jarvis 的功能 02：把本地改好的站点构建校验、提交、推送，交给 Actions 上线。"
order: 2
updated: "2026-11-15"
---

## 为什么单独做一个功能

本地是**工地**，线上是**展厅**。两边混在一起容易出事：改到一半被推上去、构建失败却已经上线、提交历史一团乱。

所以流程被拆成两步：

```
本地编辑（功能 01）  →  发布（功能 02）  →  GitHub Actions  →  线上
```

只有你确认「这一版可以了」，才走到右边。

## 一、打开

```bash
cd ../jarvis && npm start        # http://127.0.0.1:4400
```

顶栏切到「发布」（或按 `⌘⇧E`）。

## 二、界面

| 卡片 | 内容 |
| --- | --- |
| 仓库 | 当前分支、远端地址、领先/落后多少个提交、提交身份 |
| 待提交改动 | 每个文件的变更状态与增删行数 |
| 提交信息 | 写一句话，点「提交」 |
| 最近提交 | 最近 5 条，用来确认提交上了 |
| 构建输出 | 点「构建校验」或「推送」后出现 |

## 三、首次配置远端

仓库没连过 GitHub 时，远端显示「未设置」：

1. 点「设置远端」；
2. 填入仓库地址，形如 `https://github.com/用户名/仓库名.git`；
3. 保存。之后会显示 Actions 链接。

> 只接受 GitHub 地址（https 或 ssh），其他 URL 一律拒绝。

## 四、首次上线（GitHub Pages）

推到远端只是第一步，要让 Pages 真的发出去，还要在 GitHub 上做三件事：

1. **仓库转公开** —— Settings → General → 最下方 Danger Zone → Change visibility → Public
   （私有仓库用 Pages 需要 Pro；免费账号必须公开）
2. **开启 Pages** —— Settings → Pages → Build and deployment → Source 选 **GitHub Actions**
3. **重跑工作流** —— Actions 标签页 → 上次失败的 “Deploy to GitHub Pages” → Re-run all jobs

成功后站点在 `https://<用户名>.github.io/`。

> 本项目仓库 `thj2333.github.io` 就是用户站点仓库，所以根路径直接是主页；换成普通仓库时会部署到 `/<仓库名>/`，需要在 `astro.config.mjs` 里补 `base`。

### 替换旧站的正确姿势

旧站和本站历史不相干，直接推会被拒。安全的做法是先把旧站存档再覆盖：

```bash
# 1. 旧站存成 legacy 分支
git push origin origin/master:refs/heads/legacy

# 2. 新站覆盖 master（--force 会改写历史）
git push --force origin master
```

之后远端保留 `legacy`（旧站）与 `master`（新站）两条分支，随时能回头看。

## 五、日常流程

1. **构建校验** —— 跑 `npm run build`，通过才继续。失败会显示日志尾部。
2. **写提交信息** —— 一句话说清改了什么。
3. **提交** —— `git add -A` + commit。
4. **推送并部署** —— 推到 `origin/master`，GitHub Actions 自动构建并发布 Pages。
5. 点「Actions ↗」看构建结果，绿了就上线了。

> 建议顺序：先构建，再提交。构建失败时提交也能撤回，但没必要给自己添麻烦。

## 六、状态怎么看

- **领先 N**：本地有 N 个提交还没推上去。只有这时「推送」按钮才可用。
- **落后 N**：远端有新提交（比如你在别处改过）。此时先 `git pull`，否则推送会被拒。
- **提交身份**：读取仓库的 `user.name` / `user.email`；没配置时用内置默认值，并在后面标注「（默认）」。

## 七、常见问题

**推送失败 `rejected (fetch first)`？** 远端有你本地没有的提交。到终端跑 `git pull --rebase` 再回来推。

**构建校验一直转？** 首次构建要装依赖、编译 Tailwind，十几秒正常；超过两分钟会超时失败。

**提交了但线上没变？** 看看「领先」是不是还有数字——没推上去就还没部署。推到 `master` 才会触发 Actions。

**能撤销提交吗？** 这个工具只做「加、提交、推」，不做回滚。撤销请到终端用 `git reset`。

## 八、边界

- 只操作当前仓库的 `origin`，不碰其他 remote。
- 提交信息不能为空；没有改动时拒绝提交。
- 推送目标固定为当前分支，不会强推（没有 `--force`）。
- 所有 git 命令都在项目根目录执行，参数不经 shell 拼接。

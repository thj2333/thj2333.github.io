---
title: "AI 工具全景（2026.11 版）"
date: 2026-11-15
category: "清单"
excerpt: "编程/对话、设计创作、实用工具三大类，约 90 个第一梯队工具。开源附 GitHub，闭源附官网。持续更新。"
issue: 4
tags: ["AI", "工具", "清单", "持续更新"]
draft: false
updated: true
---

> **口径**：只收目前用户量/讨论度第一梯队的，不追求穷举。版本号截至 **2026-11**，更新很快，过几个月可能就对不上。
> **标记**：🔓 = 开源（附 GitHub / 权重仓库）　🔒 = 闭源（只附官网/产品页）
> **链接核对**：2026-11-15 在本机批量测过 105 条，77 条直连 200；其余多为 Cloudflare 人机校验或区域限制（ChatGPT、Gemini、HuggingFace、部分 .ai 域名），普通浏览器里能开。
> **注意**：「开源」在 AI 圈要分两种——真正 OSI 开源，和**只开放权重**（license 可能禁止商用）。下面遇到会单独标注。

---

## 0. 先厘清三个概念（你要区分的那个）

这是理解第 1 类的前提，三者经常被混为一谈：

| 层 | 是什么 | 例子 |
| --- | --- | --- |
| **Model（模型）** | 一组权重/一个 API，只负责「思考」 | GPT-5.5、Claude Opus 5、Gemini 3.8、DeepSeek V4 |
| **Harness / Agent（脚手架）** | 套在模型外面的壳：给工具调用、读写文件、跑终端、多轮自主执行 | Claude Code、Codex、Cursor、Cline、OpenHands |
| **App（产品）** | 面向人的界面与会话入口 | ChatGPT、claude.ai、Gemini、Cursor 的 IDE 本体 |

对应关系举例：

- `Claude Opus 5`（model） → `Claude Code`（harness） → 终端/IDE 里用
- `GPT-5.5`（model） → `Codex`（harness） → `ChatGPT` 或 IDE 里用
- `Cursor` 是 **harness + app**，模型可以在里面换（Claude / GPT / Gemini 都行）——这就是为什么它不能被归到「模型」里

---

## 1. 编程 / 对话 AI

### 1.1 前沿模型（闭源）

| 模型 | 厂商 | 入口 |
| --- | --- | --- |
| GPT-5.5 / GPT-5.5 Pro | OpenAI | https://chatgpt.com ｜ https://openai.com |
| Claude Opus 5 / Sonnet 5 | Anthropic | https://claude.ai |
| Gemini 3.8 Flash / Pro | Google | https://gemini.google.com |
| Grok | xAI | https://grok.com |
| Kimi K3 / K2.6 | Moonshot | https://www.kimi.com |

### 1.2 开源权重模型 🔓

| 模型 | 厂商 | 仓库 |
| --- | --- | --- |
| DeepSeek V4-Pro / V4-Flash | 深度求索 | https://github.com/deepseek-ai |
| Kimi K3 / K3.1（1M 上下文） | Moonshot | https://www.kimi.com（权重见 HF：搜 moonshotai） |
| GLM-5.3 / GLM-5.3-Flash | 智谱 | https://chat.z.ai ｜ https://open.bigmodel.cn |
| Qwen3.6 / 3.8 | 阿里 | https://github.com/QwenLM/Qwen3 ｜ https://chat.qwen.ai |
| Gemma 4 | Google | https://github.com/google-deepmind/gemma |
| Llama 系列 | Meta | https://github.com/meta-llama |

> 这几个是 2026 开源榜单的常客：Kimi K3、GLM-5.3、DeepSeek V4、Qwen3.8 轮流坐头把交椅，选型时按「显存能不能放下」比按跑分更实际。

### 1.3 编程 Agent / Harness

**闭源 🔒**

| 工具 | 说明 | 链接 |
| --- | --- | --- |
| Claude Code | 目前心智份额第一（~28%），终端/IDE/云端 | https://code.claude.com |
| OpenAI Codex | GPT-5.5 的官方壳，CLI + IDE + 云端 | https://openai.com/codex |
| Cursor | AI 原生 IDE，模型可换 | https://cursor.com |
| Windsurf | Cascade 模式，被收购后仍在迭代 | https://windsurf.com |
| GitHub Copilot | 覆盖最广，企业里最常见 | https://github.com/features/copilot |
| Trae（字节） | 中文体验好，SOLO/Work 模式 | https://www.trae.ai |
| Google Antigravity | Google 的 agent-first IDE | https://antigravity.google |
| Kimi Code | Kimi 的 CLI + VS Code 插件 | https://www.kimi.com/code |

**开源 🔓**

| 工具 | 说明 | 仓库 |
| --- | --- | --- |
| Cline | VS Code 里的开源 agent，最常用 | https://github.com/cline/cline |
| OpenHands | 前 OpenDevin，完整 agent 平台 | https://github.com/All-Hands-AI/OpenHands |
| Aider | 终端 git 友好型，老牌 | https://github.com/Aider-AI/aider |
| Goose | Block 出品，本地可跑 | https://github.com/block/goose |
| Gemini CLI | Google 官方开源 CLI | https://github.com/google-gemini/gemini-cli |
| Codex CLI | OpenAI 官方开源 CLI | https://github.com/openai/codex |
| OpenClaw | 个人 AI 助手运行时，「自己掌控数据」 | https://github.com/openclaw/openclaw |
| hermes-agent | NousResearch，自进化型 agent | https://github.com/NousResearch/hermes-agent |
| superpowers | Agent Skills 框架 + 开发方法论 | https://github.com/obra/superpowers |

### 1.4 对话 / 搜索 / 浏览

| 产品 | 类型 | 链接 |
| --- | --- | --- |
| ChatGPT | 对话 + Agent 模式 | https://chatgpt.com |
| Claude | 对话 + Projects + Code | https://claude.ai |
| Gemini | 对话 + Deep Research | https://gemini.google.com |
| DeepSeek | 对话（便宜、中文强） | https://chat.deepseek.com |
| Kimi | 长上下文 + Agent Swarm | https://www.kimi.com |
| 豆包 | 字节，国内用户量最大之一 | https://www.doubao.com |
| 通义 | 阿里 | https://www.tongyi.com |
| 腾讯元宝 | 腾讯 | https://yuanbao.tencent.com |
| Grok | xAI | https://grok.com |
| Perplexity | 搜索型 | https://www.perplexity.ai |
| Comet（Perplexity） | Agent 浏览器，流量占比第一（~48%） | https://comet.perplexity.ai |
| NotebookLM | 文档问答/播客化 | https://notebooklm.google.com |

---

## 2. 设计 / 创作 AI

### 2.1 图像生成

**闭源 🔒**

| 模型/产品 | 厂商 | 链接 |
| --- | --- | --- |
| GPT Image 1.5 | OpenAI | https://chatgpt.com ｜ https://openai.com/index/gpt-image |
| Nano Banana Pro / 2 | Google | https://gemini.google.com |
| Seedream 5.0 | 字节（即梦/豆包） | https://jimeng.jianying.com ｜ https://www.doubao.com |
| Midjourney | Midjourney | https://www.midjourney.com |
| Ideogram | 文字排版强 | https://ideogram.ai |
| Krea | 实时生成 + 编辑 | https://www.krea.ai |
| Recraft | 矢量/品牌向 | https://www.recraft.ai |

**开源 🔓**

| 模型 | 说明 | 仓库 |
| --- | --- | --- |
| FLUX.2 [dev] | BFL，32B，**非商用许可**（klein 有开放版） | https://bfl.ai（权重在 HF：black-forest-labs） |
| Qwen-Image 2.1 | 阿里，中英文字渲染强 | https://github.com/QwenLM/Qwen-Image |
| Stable Diffusion 3.5 | Stability | https://stability.ai（权重在 HF：stabilityai） |
| Anima | 结构控制 / 编辑（ComfyUI 生态） | 见 https://comfy.org |
| MOSS-Image | 开源新秀，ComfyUI 友好 | 见 https://comfy.org |

### 2.2 视频生成

**闭源 🔒**

| 模型/产品 | 厂商 | 链接 |
| --- | --- | --- |
| Veo 3.1 | Google | https://deepmind.google/models/veo/ |
| Kling 3.0 | 快手 | https://klingai.com |
| Seedance 2.0 | 字节（即梦） | https://jimeng.jianying.com |
| Gemini Omni Flash | Google（多模态视频） | https://gemini.google.com |
| Hailuo / MiniMax | MiniMax | https://hailuoai.video |
| Runway | Runway | https://runwayml.com |
| Luma Dream Machine | Luma | https://lumalabs.ai |
| Pika | Pika | https://pika.art |

**开源 🔓**

| 模型 | 说明 | 仓库 |
| --- | --- | --- |
| Wan 2.2 | 阿里，**最后一个开源的 Wan 版本** | https://github.com/Wan-Video/Wan2.2 |
| HunyuanVideo | 腾讯，13B 开源视频 | https://github.com/Tencent/HunyuanVideo |
| LTX-Video | Lightricks，快 | https://github.com/Lightricks/LTX-Video |
| Mochi 1 | Genmo | https://github.com/genmoai/mochi |
| Open-Sora | 社区复现 | https://github.com/hpcaitech/Open-Sora |

> ⚠️ **两个坑**：① **Sora 已于 2026-03 关停**，API 也在 2026-09-24 停服，别再用；② **Wan 2.5 / 3.0 从未开放权重**，网上不少文章写错了，想本地跑只能用 Wan 2.2。

### 2.3 3D 生成

**闭源 / 商业 🔒**

| 产品 | 说明 | 链接 |
| --- | --- | --- |
| Meshy 7 | 文/图生 3D，插件生态全 | https://www.meshy.ai |
| Tripo P2 | 原生四边面拓扑，进生产流程 | https://www.tripo3d.ai |
| Hi3D 3.0 | 可打印向：分色、摆盘、切片对接 | https://www.hi3d.ai |
| Rodin（Hyper3D） | 质量与可控性口碑最好之一 | https://hyper3d.ai |

**开源 🔓**

| 模型 | 说明 | 仓库 |
| --- | --- | --- |
| Hunyuan3D 3.0 / 3.1 | 腾讯，免费可本地部署 | https://github.com/Tencent-Hunyuan/Hunyuan3D-2 ｜ https://3d.hunyuan.tencent.com |
| TRELLIS 2 | 微软，结构化 3D 表示 | https://github.com/microsoft/TRELLIS |
| TripoSR | Tripo + Stability 的快速重建 | https://github.com/VAST-AI-Research/TripoSR |
| Stable Fast 3D | Stability | https://github.com/Stability-AI/stable-fast-3d |

### 2.4 音频 / 音乐（附加）

| 工具 | 开源？ | 链接 |
| --- | --- | --- |
| Suno | 🔒 | https://suno.com |
| Udio | 🔒 | https://www.udio.com |
| ElevenLabs | 🔒 | https://elevenlabs.io |
| Fish Audio | 🔓 https://github.com/fishaudio/fish-speech | https://fish.audio |
| GPT-SoVITS | 🔓 https://github.com/RVC-Boss/GPT-SoVITS | — |
| CosyVoice | 🔓 https://github.com/FunAudioLLM/CosyVoice | — |

---

## 3. 实用 AI 工具

### 3.1 Agent 框架 / 技能生态 🔓

| 项目 | 用途 | 仓库 |
| --- | --- | --- |
| superpowers | Skills 框架 + 方法论 | https://github.com/obra/superpowers |
| anthropics/skills | 官方 Agent Skills 合集 | https://github.com/anthropics/skills |
| MCP（Model Context Protocol） | 模型接工具的协议事实标准 | https://github.com/modelcontextprotocol |
| claude-skills（社区市场） | 技能分发/插件市场 | https://github.com/oaustegard/claude-skills |
| LangChain / LangGraph | 老牌编排框架 | https://github.com/langchain-ai/langchain |
| CrewAI | 多 agent 角色分工 | https://github.com/crewAIInc/crewAI |
| AutoGen | 微软多 agent | https://github.com/microsoft/autogen |
| Dify | 可视化 LLM 应用平台 | https://github.com/langgenius/dify ｜ https://dify.ai |
| n8n | 自动化工作流（接 AI 节点） | https://github.com/n8n-io/n8n ｜ https://n8n.io |
| Flowise | 拖拽式 agent 编排 | https://github.com/FlowiseAI/Flowise |
| firecrawl | 把网页抓成 LLM 可用数据 | https://github.com/firecrawl/firecrawl |

### 3.2 本地推理 / 自托管 🔓

| 项目 | 用途 | 链接 |
| --- | --- | --- |
| Ollama | 一行命令跑本地模型 | https://github.com/ollama/ollama ｜ https://ollama.com |
| LM Studio | 图形化本地模型（闭源） | https://lmstudio.ai |
| vLLM | 生产级高吞吐推理 | https://github.com/vllm-project/vllm |
| llama.cpp | CPU/Metal 友好底层 | https://github.com/ggml-org/llama.cpp |
| Open WebUI | 自托管 ChatGPT 界面 | https://github.com/open-webui/open-webui |
| LobeChat | 自托管对话 + 插件 | https://github.com/lobehub/lobe-chat |

### 3.3 创作工作流 🔓

| 项目 | 用途 | 链接 |
| --- | --- | --- |
| ComfyUI | 节点式图像/视频工作流，生态最大 | https://github.com/comfyanonymous/ComfyUI ｜ https://comfy.org |
| InvokeAI | 更规整的 SD 工作台 | https://github.com/invoke-ai/InvokeAI |
| Stable Diffusion WebUI Forge | 老牌 WebUI 的加速分支 | https://github.com/lllyasviel/stable-diffusion-webui-forge |

### 3.4 商业生产力 🔒

| 产品 | 用途 | 链接 |
| --- | --- | --- |
| Notion AI | 文档 + 数据库 | https://www.notion.com |
| Gamma | 一句话出 PPT | https://gamma.app |
| Canva Magic Studio | 设计模板 + AI | https://www.canva.com |
| Figma AI | 设计稿到代码 | https://www.figma.com |
| HeyGen | 数字人视频 | https://www.heygen.com |
| Descript | 播客/视频剪辑（文本编辑） | https://www.descript.com |
| Otter.ai | 会议记录 | https://otter.ai |

---

## 4. 按用途的选型建议

| 你想干什么 | 首选 | 省钱/开源替代 |
| --- | --- | --- |
| 写代码（重度） | Claude Code、Codex | Cline + DeepSeek V4 / Qwen3.8 |
| 写代码（图形界面） | Cursor、Trae | VS Code + Cline |
| 日常问答 | ChatGPT、Claude、Gemini | 本地 Ollama + GLM-5.3 |
| 中文写作/长文 | Kimi、DeepSeek、豆包 | Qwen |
| 出图（要中文字） | Seedream 5.0 | Qwen-Image 2.1 |
| 出图（要质量） | Nano Banana Pro、GPT Image 1.5 | FLUX.2 [dev]（非商用） |
| 出视频 | Kling 3.0、Veo 3.1、Seedance 2.0 | Wan 2.2（本地） |
| 3D（商用） | Meshy 7、Tripo P2 | Hunyuan3D 3.1（自部署） |
| 3D 打印 | Hi3D | Hunyuan3D + 切片软件 |
| 自动化流程 | n8n、Dify | 自托管同一套 |

---

## 5. 2026 现状的几条校正（容易踩坑）

1. **Sora 没了** — 2026-03 关停应用，2026-09-24 停 API。所有把它列进「推荐视频模型」的文章都过期了。
2. **Wan 2.5 / 3.0 不开源** — 权重从未发布；能本地跑的最后一版是 Wan 2.2。
3. **ChatGPT Atlas 浏览器并入 ChatGPT** — 独立的 AI 浏览器现在主要看 Comet。
4. **「开源权重」≠「开源」** — FLUX.2 [dev] 是非商用许可，Gemma 有自己的使用条款，商用前要看清。
5. **版本号变得很快** — 本文写于 2026-11，半年后再看大概率过时，选型前建议直接看各家官网的 release notes。

# AI 榜单站点与工具目录（2026.11）

> 你要的是「榜单网站本身」，不是榜上的名次。按模态和用途分组，标注每个站的核心价值。
> 采集时间 2026-11-15。

---

## 0. 如果只收藏六个

| 站 | 一句话 | 链接 |
| --- | --- | --- |
| **Artificial Analysis** | 唯一横跨 LLM / 图像 / 视频 / 语音，且同时给价格与延迟的独立站 | https://artificialanalysis.ai |
| **LMArena** | 人类盲投的鼻祖，Text / Code / WebDev / Vision 多个竞技场 | https://lmarena.ai |
| **LiveBench** | 反污染 + 长程任务，自带「每次成功任务成本」 | https://livebench.ai |
| **Epoch AI** | 用 50+ 个榜合成一个「通用能力」尺度（ECI），解决基准饱和问题 | https://epoch.ai/benchmarks |
| **top3d.ai** | 3D 生成的人类盲测 Elo，带单价与生成耗时 | https://www.top3d.ai/leaderboard |
| **OpenCompass（司南）** | 中文与多模态覆盖最全的客观评测 | https://opencompass.org.cn |

---

## 1. 综合性 / 横向对比

| 站 | 覆盖 | 特点 | 链接 |
| --- | --- | --- | --- |
| Artificial Analysis | LLM、图像、视频、语音、TTS、价格、延迟 | 有 Intelligence Index 合成分；**Video Arena 与 Speech Arena 是行业事实标准**；提示集每月轮换防背题 | https://artificialanalysis.ai |
| LMArena（原 Chatbot Arena） | 文本、代码、视觉、搜索、WebDev | 盲投 Elo（Bradley-Terry），更新最快；数据在 HF 开放 | https://lmarena.ai |
| LiveBench 2.0 | 综合 + Agentic/Design/Coding/Browser/Data/Research | 官方主打 contamination-free；**公开每任务成本** | https://livebench.ai |
| Epoch AI · ECI | 50+ 基准合成 | 用「模型在多个榜上的交叉表现」推难度，抗饱和 | https://epoch.ai/benchmarks |
| LLM Stats | 380+ 模型、50+ 基准 | 每日更新，自称来源核验、非自报；提供 API / MCP | https://llm-stats.com |
| Village LLM Atlas | 跨家族汇总（Arena / Code / WebDev / HLE…） | 把多个竞技场的分数字段并列，适合横向扫 | https://atlas.village.dev |
| Rank.ai | 多榜共识排名 | 把 AA / LiveBench / Arena / BFCL 归一化后取均值 | https://www.rank.ai/llm-leaderboard |
| Scale SEAL | 专家设计私有集（Agentic、编码、网络安全） | 曾很权威，但**多数分榜自 2025-03 起未更新**，慎用 | https://scale.com/leaderboard |

## 2. 中文 / 国产模型

| 站 | 覆盖 | 特点 | 链接 |
| --- | --- | --- | --- |
| OpenCompass 司南 | LLM 语言榜 + 多模态榜 | 上海 AI Lab 出品；多模态维度拆得最细；官方闭源题集 | https://opencompass.org.cn |
| SuperCLUE | 中文人类盲投竞技场 | **直接给 95% 置信区间和对战次数**，透明度高于 LMArena | https://www.superclueai.com/arena |
| Hugging Face Open LLM Leaderboard | 开源模型 | 侧重重现性，适合筛开源底座 | https://huggingface.co/spaces/open-llm-leaderboard |

## 3. 图像 / 设计

| 站 | 覆盖 | 特点 | 链接 |
| --- | --- | --- | --- |
| Artificial Analysis · Image Arena | 文生图 / 图像编辑盲测 | 与视频榜同一套方法论 | https://artificialanalysis.ai/text-to-image |
| LMArena · Vision | 多模态对话 + 图像 | 适合看「图文理解」而非纯生成 | https://lmarena.ai |
| Design Arena | **Web 设计**盲投（单文件 HTML / 全栈 agentic 双榜） | 看「生成的前端好不好看」最贴的一个 | https://www.designarena.ai |
| WebDev Arena（LMArena） | 参考图生成网页 | 与 Design Arena 互补，采样更多 | https://lmarena.ai |

## 4. 视频

| 站 | 覆盖 | 特点 | 链接 |
| --- | --- | --- | --- |
| Artificial Analysis · Video Arena | 文生视频 / 图生视频（含/不含音频） | 58,000+ 人类投票，1080p 盲测；**唯一被广泛引用的视频 Elo** | https://artificialanalysis.ai/video/arena |
| AA-Video-I2V v2.1 | 图生视频专项 | 单独榜，含文字渲染等单项分 | https://artificialanalysis.ai |
| VBench Leaderboard | 16 个维度自动评测（CVPR 2024 起） | 学术口径，不用人投票；HF 上可直接看 | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |

## 5. 3D 生成

| 站 | 覆盖 | 特点 | 链接 |
| --- | --- | --- | --- |
| top3d.ai | 3D 生成盲测 Elo（textured / geometry 等） | 带 **win rate、投票数、单价、生成耗时**；开源与闭源一锅排 | https://www.top3d.ai/leaderboard |
| Meshy / Tripo 官方案例库 | 单家展示 | 只能当作品集看，别当排行榜 | https://www.meshy.ai ｜ https://www.tripo3d.ai |

## 6. 语音 / 音乐 / 语音识别

| 站 | 覆盖 | 特点 | 链接 |
| --- | --- | --- | --- |
| Artificial Analysis · Speech Arena | TTS 盲测 Elo | 前五名常常只差 20 几分，注意区分度 | https://artificialanalysis.ai/text-to-speech/leaderboard |
| Open ASR Leaderboard | 语音识别（86 模型 / 11 数据集） | 多语言 + 长音频，评测脚本开源 | https://huggingface.co/spaces/hf-audio/open-asr-leaderboard |
| Music Arena 类聚合 | 文生音乐（Suno / Udio / Eleven Music） | 没有单一权威榜，多为聚合站拼票数 | 见 Kubeez 等聚合页 |

## 7. 代码 / Agent

| 站 | 覆盖 | 特点 | 链接 |
| --- | --- | --- | --- |
| SWE-bench | 真实 GitHub issue 修复 | **前几名已 96%，饱和**，现在只当门槛 | https://www.swebench.com |
| Terminal-Bench | 终端长程任务 | 现在最接近「真干活」的编程榜 | https://www.tbench.ai |
| BFCL v4 | 函数调用 / 工具调用 | 单轮 + 多轮 + agentic，还有幻觉与格式敏感性分项 | https://gorilla.cs.berkeley.edu/leaderboard.html |
| Aider Polyglot | 多语言改代码 | 更新慢，很多行是厂商自报 | https://aider.chat/docs/leaderboards |
| LiveCodeBench | 竞赛题（防污染） | 按时间切题，避免训练泄漏 | https://livecodebench.github.io |
| GAIA / WebArena / OSWorld | 通用助手 / 网页 / 桌面操作 | Agent 能力三件套，各自有官方榜 | https://huggingface.co/spaces/gaia-benchmark/leaderboard |

## 8. 嵌入 / 检索

| 站 | 覆盖 | 特点 | 链接 |
| --- | --- | --- | --- |
| MTEB Leaderboard | 文本嵌入 / 重排 | 事实标准，选 RAG 底座必看 | https://huggingface.co/spaces/mteb/leaderboard |

## 9. AI 工具目录（收录工具，不是排名）

| 站 | 规模 / 特点 | 链接 |
| --- | --- | --- |
| Futurepedia | 老牌，分类细，更新勤 | https://www.futurepedia.io |
| There's An AI For That | 号称最大，按任务场景检索 | https://theresanaiforthat.com |
| Toolify | 收录量大，带流量数据 | https://www.toolify.ai |
| Dang.ai | 精选向，人工筛选 | https://dang.ai |
| Future Tools | 由 Matt Wolfe 维护，偏创作者 | https://www.futuretools.io |
| The Rundown | 日报 + 工具库，偏资讯 | https://www.therundown.ai |
| Product Hunt | 新品首发地，能看真实热度 | https://www.producthunt.com |
| Hugging Face Spaces | 开源 demo 的聚集地 | https://huggingface.co/spaces |
| HaiAi123（中文） | 1400+ 工具，17 分类，三语 | https://haiai123.com |
| awesome-ai-benchmarks（GitHub） | 榜单大全，按类别整理 | https://github.com/tatn/awesome-ai-benchmarks |
| awesome-ai-directory（GitHub） | 导航站大全，带 DR 数据 | https://github.com/iAmCorey/awesome-ai-directory |

## 10. 判断一个榜靠不靠谱：五问

1. **谁出的？** 独立第三方（AA、Epoch、LMArena）> 厂商自报 > 转述聚合。
2. **样本量多少？** 没有投票数/题目数的榜，直接跳过。
3. **置信区间有没有？** 有 CI 的榜（SuperCLUE）比只给名次的诚实。
4. **题目公开吗？** 全公开的题集迟早被污染；AA 那种每月轮换、只放 5% 进公开池的做法更可信。
5. **最近一次更新？** 2026 年很多榜停更了（Scale SEAL 就停在 2025-03），镜像站会把停更数据照搬过来。

> ⚠️ 额外提醒：2026-04 UC Berkeley 的复现研究指出，**8 个主流 agent 基准都能被 reward-hack 到接近 100%**。看到某个模型在单一 agent 榜上「碾压」，先找第二、第三个榜交叉验证。

# 大模型竞技榜调研（2026.11）

> 数据采集于 2026-11-15。榜单天天变，具体分数只有「当时的参考价值」，方法论才是能长期用的东西。

## 0. 先说三个结论

1. **没有一个榜能单独下结论。** 2026 年 11 月，LMArena 的文本榜首是 Gemini 4 Carbon，创意编程/前端榜首是 Claude Opus 5.5，LiveBench 综合榜首是 Claude Fable 5.1，OpenCompass 是 Claude Opus 5，OpenRouter 的用量王是 DeepSeek V4.1 Flash。**它们都对，只是测的东西不一样。**
2. **头部已经挤在一起了。** LMArena 前几名差 20 分以内（1527 vs 1506），而 100 分才对应约 64% 胜率——二十几分在统计上分不出高下。前五名互换位置是常态，别把名次当铁律。
3. **编程榜正在失效。** SWE-bench Verified 前三名已经 95–96%，天花板效应明显；现在看编程能力得看 Terminal-Bench、SWE-Lancer 这类更长程、更接近真实工作流的榜。

---

## 1. 三类榜单，别混着看

| 类型 | 原理 | 优点 | 缺陷 |
| --- | --- | --- | --- |
| **人类盲投**（对战 Elo / Bradley-Terry） | 匿名两两对比，人来投票 | 贴近「用起来舒服」 | 偏好排版和长度、可被私测操纵、无法测长程任务 |
| **自动化测试集** | 固定题目跑分 | 可复现、可细分维度 | 污染、过拟合、饱和、题目一公开就失效 |
| **真实使用量** | 统计 API 网关的 token 份额 | 反映真金白银的选择 | 不等于能力，只反映性价比与生态 |

---

## 2. 各榜档案

### 2.1 人类盲投类

**LMArena（原 Chatbot Arena）** — https://lmarena.ai
最知名的人类投票榜，2026 年已拆成多个竞技场：Text、Code、Vision、Search、WebDev（Design）。评分是 Bradley-Terry，Elo 单位。
- 更新：近乎每日
- 数据开放：`lmarena-ai/leaderboard-dataset`（HuggingFace，CC BY 4.0）
- 2026-11-09 文本榜前列：Gemini 4 Carbon **1527**、Gemini 4 Argon 1522、Claude Opus 5.5 1506（#4）、Claude Opus 5 1490（#13）
- Code Arena 榜首：Claude Opus 5.5 **1820**
- WebDev Arena 前列：Claude Opus 5.5 1837、Claude Sonnet 5.5 1824、GPT-6 Astra 1807

**SuperCLUE 竞技场** — https://www.superclueai.com/arena
中文语境的人类盲投，给出 95% 置信区间和对战次数（这点比 LMArena 透明）。
- 2026-11 榜首：一个 OpenAI 模型 **1411.4**，第二 1327.1（国外），第三 1291.8（字节跳动）
- 值钱的地方：能看出中文场景里国内外模型的真实差距

**Design Arena / WebDev Arena** — https://benchlm.ai/benchmarks/designarenawebsite
比的是「生成的网页好不好看」。当前：Muse Wonder（Meta）1370、Muse Spark 1.3 1354、Kimi K3 1333。

### 2.2 自动化测试集

**LiveBench 2.0** — https://livebench.ai
官方定位「contamination-free + 长程任务」，2026-10-25 版把维度拆成 Agentic / Design / Coding / Browser Use / Data Analysis / Research / Reasoning。
- 最新综合：Claude Fable 5.1 **85.7**、GPT-6 Astra 85.6、Claude Opus 5.5 85.1、GPT-6.1 Sol 84.1
- 亮点：**同时公布每个任务的成本**（$0.819 到 $7.406 不等），性价比一眼可见

**OpenCompass（司南）** — https://opencompass.org.cn
国内高校系（上海 AI Lab）的客观评测，多模态榜做得比国外细。
- 2026-08 语言榜：Claude Opus 5 (high) **83.3**、GPT-5.6-Sol 80.8、Qwen3.8-Max 80.6、GPT-5.5 80.5
- 价值：中文能力、多模态、国产模型覆盖最全

**Artificial Analysis** — https://artificialanalysis.ai
Intelligence Index 是「多个评测的加权合成」，2026 版叫 v5.0.1，含 9 项（AA-Briefcase、AutomationBench、Terminal-Bench 4.0、FrontierCode、HLE-Diamond 等）。同时也做价格/延迟对比，是选型时最实用的一个。

**HLE（Humanity's Last Exam）** — 专家级难题，专门用来看「天花板还差多远」。
- 当前最高：Claude Mythos Preview **56.8%**（BenchGecko 口径）；Artificial Analysis 口径的 HLE 榜首是 Claude Opus 5.5 **61.4%**
- 意义：这是少数**榜首还不到 65 分**的榜，说明难题集还没被吃透

### 2.3 编程与工具调用（分得更细）

| 榜 | 测什么 | 2026-11 现状 | 链接 |
| --- | --- | --- | --- |
| **SWE-bench Verified** | 修真实 GitHub issue | GPT-5.6 Sol 96.2、Claude Opus 5 96.0、Claude Fable 5 95.0 —— **已饱和** | https://www.swebench.com |
| **Terminal-Bench 2.0** | 终端里的长程任务 | Codex CLI + GPT-5.5 **82.2%** | https://www.tbench.ai |
| **Aider Polyglot** | 多语言改代码 | 老数据仍被引用（Gemini 2.5 Pro 82.2%），更新慢 | https://aider.chat/docs/leaderboards |
| **BFCL v4** | 函数/工具调用（单轮+多轮+agentic） | BTL-3（开源）**88.5**、Atria Dawn 77.0、Qwen3.7 Max 75.0 | https://gorilla.cs.berkeley.edu/leaderboard.html |

### 2.4 真实使用量

**OpenRouter Rankings** — https://openrouter.ai/rankings
按 token 处理量排名，**明确声明不衡量能力**。
- 2026-10：DeepSeek V4.1 Flash 占 **24.69%** 的 token，DeepSeek 一家占 37.6%；周度 token 前五全部是中国模型；中国厂商约占请求量的 48%
- 正确用法：判断「开发者愿意为什么付钱」，以及性价比拐点在哪

---

## 3. 读榜的六个坑

1. **置信区间比名次重要。** LMArena 1527 对 1506 只差 21 分；SuperCLUE 会直接给 ±20 左右的 CI。名次差 3 位可能完全等价。
2. **私测与撤分。** NeurIPS 2025 的论文 *The Leaderboard Illusion* 指出：少数厂商能私下测多个变体、只公开最好的一个、甚至撤回分数——这让公开榜的公平性被系统性扭曲。
3. **基准污染。** 题目一公开，训练集就可能混进去。SWE-bench 从 85 涨到 96 只用了一年，天花板效应之外，也要警惕过拟合。
4. **自报 vs 复现。** 有些榜（如 Aider Polyglot 的很多行）是各家自己报的数，不是第三方复跑。看来源栏。
5. **风格偏好。** 人类投票天然奖励排版漂亮、回答长的模型。同样的正确答案，加粗和分点会赢。
6. **用量榜 ≠ 能力榜。** DeepSeek 在 OpenRouter 上份额第一，主要是因为便宜——这是选型的信号，不是能力的证据。

---

## 4. 按用途选榜

| 你想知道 | 看这个 | 补充 |
| --- | --- | --- |
| 聊天用起来爽不爽 | LMArena Text | 别只看第一，看前十的 CI 是否重叠 |
| 中文场景怎么样 | SuperCLUE 竞技场 + OpenCompass | 两者都要看，一个偏人类偏好一个偏客观题 |
| 写代码行不行 | Terminal-Bench 2.0 + LiveBench Coding | SWE-bench 已饱和，仅作门槛参考 |
| 能不能真的当 agent 用 | BFCL v4 + Terminal-Bench + LiveBench Agentic | 工具调用和长程执行是两回事 |
| 做网站/前端好不好看 | WebDev Arena / Design Arena | 主观性强，最好自己下 prompt 试 |
| 性价比 | Artificial Analysis（智能指数 vs 价格） | 同一智能水平下比每美元 |
| 别人在用什么 | OpenRouter Rankings | 反映生态与成本，不反映能力 |
| 还差人类多远 | HLE | 唯一没被刷满的榜 |

---

## 5. 一句话总结

**LMArena 看手感，LiveBench 看广度，Terminal-Bench 看干活，BFCL 看工具，OpenCompass 看中文，OpenRouter 看钱包，HLE 看距离。** 七个一起看，才能拼出一个模型的全貌——任何单一榜首都不值得当成答案。

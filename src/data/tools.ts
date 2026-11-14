/**
 * 工具柜数据
 * 全部为占位条目，功能尚未实现。
 */

export interface Assistant {
  code: string;
  name: string;
  en: string;
  duty: string;
  persona: string;
  accent: string;
  /** 接入状态，目前一律未接入 */
  status: string;
  warn?: boolean;
}

export const assistants: Assistant[] = [
  {
    code: "AI-001",
    name: "Jarvis",
    en: "Just A Rather Very Intelligent System",
    duty: "编程 / 网站建设",
    persona:
      "管家型。语气克制，不多问，你刚说「随便搭个站」，它已经把依赖装好了。对这个站的排版意见很大，但不会说。",
    accent: "#23e0ff",
    status: "未接入",
  },
  {
    code: "AI-002",
    name: "Friday",
    en: "Female Replacement Intelligent Digital Assistant Youth",
    duty: "收集信息 / 分析情报",
    persona:
      "情报官型。擅长把三条互不相干的线索拼成一个结论，也擅长告诉你「这条推断的证据只有一条」。",
    accent: "#f2a900",
    status: "未接入",
  },
  {
    code: "AI-003",
    name: "E.D.I.T.H.",
    en: "Even Dead, I'm The Hero",
    duty: "创造设计 / 建模仿真 / 3D 打印",
    persona:
      "设计师型。负责从草图到可打印文件的全流程。名字里的死指的是灵感枯竭，不是别的。",
    accent: "#f2545b",
    status: "未接入",
  },
  {
    code: "AI-004",
    name: "Ultron",
    en: "—",
    duty: "待定",
    persona:
      "人设：asshole。会对每一项需求提出「人类不该存在」的替代方案。已物理隔离，不接入任何网络。",
    accent: "#d4574e",
    status: "已隔离",
    warn: true,
  },
];

export interface Stone {
  code: string;
  name: string;
  en: string;
  color: string;
  domain: string;
  guess: string;
}

export const stones: Stone[] = [
  {
    code: "GEM-01",
    name: "空间宝石",
    en: "Space Stone",
    color: "#2f6fdb",
    domain: "传送 / 位移",
    guess: "也许是跨站检索：一按就跳到任意一期。",
  },
  {
    code: "GEM-02",
    name: "心灵宝石",
    en: "Mind Stone",
    color: "#f2c200",
    domain: "意识 / 读取",
    guess: "也许是站内摘要：把长文压成三句话。",
  },
  {
    code: "GEM-03",
    name: "现实宝石",
    en: "Reality Stone",
    color: "#c0261f",
    domain: "改写 / 重构",
    guess: "也许是排版工具：同一篇文章换四种版式。",
  },
  {
    code: "GEM-04",
    name: "力量宝石",
    en: "Power Stone",
    color: "#7b3fe4",
    domain: "能量 / 破坏",
    guess: "也许是压测工具：看看页面能扛多少并发。",
  },
  {
    code: "GEM-05",
    name: "时间宝石",
    en: "Time Stone",
    color: "#1f9d55",
    domain: "时间 / 回溯",
    guess: "也许是版本存档：把每一版页面都留一份。",
  },
  {
    code: "GEM-06",
    name: "灵魂宝石",
    en: "Soul Stone",
    color: "#e2701a",
    domain: "灵魂 / 代价",
    guess: "待定。要牺牲一样东西才能拿到，还没想好牺牲什么。",
  },
];

export interface Gen3D {
  name: string;
  url: string;
  desc: string;
  tag: string;
}

export const gen3d: Gen3D[] = [
  {
    name: "Meshy",
    url: "https://www.meshy.ai/",
    desc: "文生 3D 与图生 3D 的老牌选手，细节丰富，有 Blender / Unity 插件。",
    tag: "通用",
  },
  {
    name: "Tripo",
    url: "https://www.tripo3d.ai/",
    desc: "出模快、拓扑规整，适合直接进生产流程的网格。",
    tag: "快速",
  },
  {
    name: "Hi3D",
    url: "https://www.hi3d.ai/",
    desc: "主打可打印：自动分色、智能摆盘，直接对接切片软件。",
    tag: "打印",
  },
  {
    name: "腾讯混元 3D",
    url: "https://3d.hunyuan.tencent.com/",
    desc: "国内直连、中文提示词、免费额度大，还能本地部署。",
    tag: "免费",
  },
];

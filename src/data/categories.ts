/**
 * 博客分类
 * 顺序（order）只是默认值，前端支持拖动重排，重排结果存在 localStorage。
 */

export type CategoryId =
  | "cinema"
  | "tools"
  | "research"
  | "music"
  | "travel"
  | "whatif";

export interface Category {
  id: CategoryId;
  cn: string;
  en: string;
  desc: string;
  /** active = 已有内容；wip = 建设中 */
  status: "active" | "wip";
  /** 主色，用于角标与分区标识 */
  accent: string;
}

export const categories: Category[] = [
  {
    id: "cinema",
    cn: "IP 电影",
    en: "IP CINEMA",
    desc: "漫威、X 战警，以及与银幕有关的一切档案。",
    status: "active",
    accent: "#e0242a",
  },
  {
    id: "tools",
    cn: "实用工具",
    en: "TOOLKIT",
    desc: "AI 工具、榜单导航，以及自用的小东西。",
    status: "active",
    accent: "#f2a900",
  },
  {
    id: "research",
    cn: "技术研究",
    en: "RESEARCH",
    desc: "论文精读、复现笔记与踩过的坑。",
    status: "wip",
    accent: "#1e3a6e",
  },
  {
    id: "music",
    cn: "音乐鉴赏",
    en: "SOUNDTRACK",
    desc: "专辑、配乐、歌单，以及它们为什么好听。",
    status: "wip",
    accent: "#6b3fa0",
  },
  {
    id: "travel",
    cn: "旅游美食",
    en: "WANDER",
    desc: "去过的地方，吃过的东西，以及踩雷记录。",
    status: "wip",
    accent: "#1f8b6b",
  },
  {
    id: "whatif",
    cn: "假如",
    en: "WHAT IF",
    desc: "反事实推演：如果当时选了另一边会怎样。",
    status: "wip",
    accent: "#b3121c",
  },
];

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export const categoryIds = categories.map((c) => c.id);

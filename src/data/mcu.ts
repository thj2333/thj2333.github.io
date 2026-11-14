/**
 * MCU 档案数据
 * 只收院线电影；剧集与特辑不在此表。
 */

export interface Film {
  year: number;
  cn: string;
  en: string;
  phase: number;
  /** 是否已上映 */
  out: boolean;
  /** 可选备注，比如别名或状态说明 */
  note?: string;
}

export interface Phase {
  n: number;
  saga: string;
  name: string;
  span: string;
}

export const phases: Phase[] = [
  { n: 1, saga: "无限传奇", name: "第一阶段", span: "2008 — 2012" },
  { n: 2, saga: "无限传奇", name: "第二阶段", span: "2013 — 2015" },
  { n: 3, saga: "无限传奇", name: "第三阶段", span: "2016 — 2019" },
  { n: 4, saga: "多元宇宙传奇", name: "第四阶段", span: "2021 — 2022" },
  { n: 5, saga: "多元宇宙传奇", name: "第五阶段", span: "2023 — 2025" },
  { n: 6, saga: "多元宇宙传奇", name: "第六阶段", span: "2026 —" },
];

export const films: Film[] = [
  // ── 第一阶段 ──
  { year: 2008, cn: "钢铁侠", en: "Iron Man", phase: 1, out: true },
  { year: 2008, cn: "无敌浩克", en: "The Incredible Hulk", phase: 1, out: true },
  { year: 2010, cn: "钢铁侠 2", en: "Iron Man 2", phase: 1, out: true },
  { year: 2011, cn: "雷神", en: "Thor", phase: 1, out: true },
  {
    year: 2011,
    cn: "美国队长：复仇者先锋",
    en: "Captain America: The First Avenger",
    phase: 1,
    out: true,
  },
  { year: 2012, cn: "复仇者联盟", en: "The Avengers", phase: 1, out: true },

  // ── 第二阶段 ──
  { year: 2013, cn: "钢铁侠 3", en: "Iron Man 3", phase: 2, out: true },
  { year: 2013, cn: "雷神 2：黑暗世界", en: "Thor: The Dark World", phase: 2, out: true },
  {
    year: 2014,
    cn: "美国队长 2：冬日战士",
    en: "Captain America: The Winter Soldier",
    phase: 2,
    out: true,
  },
  {
    year: 2014,
    cn: "银河护卫队",
    en: "Guardians of the Galaxy",
    phase: 2,
    out: true,
  },
  {
    year: 2015,
    cn: "复仇者联盟 2：奥创纪元",
    en: "Avengers: Age of Ultron",
    phase: 2,
    out: true,
  },
  { year: 2015, cn: "蚁人", en: "Ant-Man", phase: 2, out: true },

  // ── 第三阶段 ──
  {
    year: 2016,
    cn: "美国队长 3：内战",
    en: "Captain America: Civil War",
    phase: 3,
    out: true,
  },
  { year: 2016, cn: "奇异博士", en: "Doctor Strange", phase: 3, out: true },
  {
    year: 2017,
    cn: "银河护卫队 2",
    en: "Guardians of the Galaxy Vol. 2",
    phase: 3,
    out: true,
  },
  {
    year: 2017,
    cn: "蜘蛛侠：英雄归来",
    en: "Spider-Man: Homecoming",
    phase: 3,
    out: true,
  },
  {
    year: 2017,
    cn: "雷神 3：诸神黄昏",
    en: "Thor: Ragnarok",
    phase: 3,
    out: true,
  },
  { year: 2018, cn: "黑豹", en: "Black Panther", phase: 3, out: true },
  {
    year: 2018,
    cn: "复仇者联盟 3：无限战争",
    en: "Avengers: Infinity War",
    phase: 3,
    out: true,
  },
  {
    year: 2018,
    cn: "蚁人 2：黄蜂女现身",
    en: "Ant-Man and the Wasp",
    phase: 3,
    out: true,
  },
  { year: 2019, cn: "惊奇队长", en: "Captain Marvel", phase: 3, out: true },
  {
    year: 2019,
    cn: "复仇者联盟 4：终局之战",
    en: "Avengers: Endgame",
    phase: 3,
    out: true,
  },
  {
    year: 2019,
    cn: "蜘蛛侠：英雄远征",
    en: "Spider-Man: Far From Home",
    phase: 3,
    out: true,
  },

  // ── 第四阶段 ──
  { year: 2021, cn: "黑寡妇", en: "Black Widow", phase: 4, out: true },
  {
    year: 2021,
    cn: "尚气与十环传奇",
    en: "Shang-Chi and the Legend of the Ten Rings",
    phase: 4,
    out: true,
  },
  { year: 2021, cn: "永恒族", en: "Eternals", phase: 4, out: true },
  {
    year: 2021,
    cn: "蜘蛛侠：英雄无归",
    en: "Spider-Man: No Way Home",
    phase: 4,
    out: true,
  },
  {
    year: 2022,
    cn: "奇异博士 2：疯狂多元宇宙",
    en: "Doctor Strange in the Multiverse of Madness",
    phase: 4,
    out: true,
  },
  {
    year: 2022,
    cn: "雷神 4：爱与雷霆",
    en: "Thor: Love and Thunder",
    phase: 4,
    out: true,
  },
  {
    year: 2022,
    cn: "黑豹 2：瓦坎达万岁",
    en: "Black Panther: Wakanda Forever",
    phase: 4,
    out: true,
  },

  // ── 第五阶段 ──
  {
    year: 2023,
    cn: "蚁人与黄蜂女：量子狂潮",
    en: "Ant-Man and the Wasp: Quantumania",
    phase: 5,
    out: true,
  },
  {
    year: 2023,
    cn: "银河护卫队 3",
    en: "Guardians of the Galaxy Vol. 3",
    phase: 5,
    out: true,
  },
  { year: 2023, cn: "惊奇队长 2", en: "The Marvels", phase: 5, out: true },
  {
    year: 2024,
    cn: "死侍与金刚狼",
    en: "Deadpool & Wolverine",
    phase: 5,
    out: true,
  },
  {
    year: 2025,
    cn: "美国队长 4：美丽新世界",
    en: "Captain America: Brave New World",
    phase: 5,
    out: true,
  },
  { year: 2025, cn: "雷霆特攻队*", en: "Thunderbolts*", phase: 5, out: true },
  {
    year: 2025,
    cn: "神奇四侠：初露锋芒",
    en: "The Fantastic Four: First Steps",
    phase: 5,
    out: true,
  },

  // ── 第六阶段 ──
  {
    year: 2026,
    cn: "蜘蛛侠：崭新之日",
    en: "Spider-Man: Brand New Day",
    phase: 6,
    out: true,
  },
  {
    year: 2026,
    cn: "复仇者联盟 5：末日",
    en: "Avengers: Doomsday",
    phase: 6,
    out: false,
    note: "12.18",
  },
  {
    year: 2027,
    cn: "复仇者联盟 6：秘密战争",
    en: "Avengers: Secret Wars",
    phase: 6,
    out: false,
  },
];

/* ---------------- 英雄 ---------------- */

export type Status = "在世" | "牺牲" | "退役" | "未知";

export interface Hero {
  cn: string;
  en: string;
  alias: string;
  team: string;
  debut: string;
  powers: string[];
  status: Status;
  accent: string;
}

export const heroes: Hero[] = [
  {
    cn: "托尼·斯塔克",
    en: "Tony Stark",
    alias: "钢铁侠 / Iron Man",
    team: "复仇者",
    debut: "《钢铁侠》(2008)",
    powers: ["战甲工程", "方舟反应堆", "战术天才"],
    status: "牺牲",
    accent: "#e0242a",
  },
  {
    cn: "史蒂夫·罗杰斯",
    en: "Steve Rogers",
    alias: "美国队长 / Captain America",
    team: "复仇者",
    debut: "《美国队长》(2011)",
    powers: ["超级士兵血清", "振金盾", "领导力"],
    status: "退役",
    accent: "#1e3a6e",
  },
  {
    cn: "索尔",
    en: "Thor Odinson",
    alias: "雷神 / Thor",
    team: "阿斯加德",
    debut: "《雷神》(2011)",
    powers: ["雷电之力", "神族体质", "风暴战斧"],
    status: "在世",
    accent: "#f2a900",
  },
  {
    cn: "布鲁斯·班纳",
    en: "Bruce Banner",
    alias: "浩克 / Hulk",
    team: "复仇者",
    debut: "《无敌浩克》(2008)",
    powers: ["伽马辐射", "超常力量", "七个博士学位"],
    status: "在世",
    accent: "#2e7d32",
  },
  {
    cn: "娜塔莎·罗曼诺夫",
    en: "Natasha Romanoff",
    alias: "黑寡妇 / Black Widow",
    team: "复仇者",
    debut: "《钢铁侠 2》(2010)",
    powers: ["间谍训练", "近身格斗", "审讯"],
    status: "牺牲",
    accent: "#b3121c",
  },
  {
    cn: "克林特·巴顿",
    en: "Clint Barton",
    alias: "鹰眼 / Hawkeye",
    team: "复仇者",
    debut: "《雷神》(2011)",
    powers: ["箭术", "临场战术", "特种作战"],
    status: "在世",
    accent: "#6a4b8a",
  },
  {
    cn: "彼得·帕克",
    en: "Peter Parker",
    alias: "蜘蛛侠 / Spider-Man",
    team: "复仇者",
    debut: "《美国队长 3》(2016)",
    powers: ["蜘蛛感应", "蛛丝", "超常敏捷"],
    status: "在世",
    accent: "#c8202c",
  },
  {
    cn: "斯蒂芬·斯特兰奇",
    en: "Stephen Strange",
    alias: "奇异博士 / Doctor Strange",
    team: "至尊法师",
    debut: "《奇异博士》(2016)",
    powers: ["秘术", "时间宝石", "维度传送"],
    status: "在世",
    accent: "#1f6f8b",
  },
  {
    cn: "旺达·马克西莫夫",
    en: "Wanda Maximoff",
    alias: "绯红女巫 / Scarlet Witch",
    team: "复仇者",
    debut: "《复仇者联盟 2》(2015)",
    powers: ["混沌魔法", "现实改写", "心灵感应"],
    status: "未知",
    accent: "#a11228",
  },
  {
    cn: "特查拉",
    en: "T'Challa",
    alias: "黑豹 / Black Panther",
    team: "瓦坎达",
    debut: "《美国队长 3》(2016)",
    powers: ["心形草", "振金战衣", "王室格斗"],
    status: "牺牲",
    accent: "#6b3fa0",
  },
  {
    cn: "彼得·奎尔",
    en: "Peter Quill",
    alias: "星爵 / Star-Lord",
    team: "银河护卫队",
    debut: "《银河护卫队》(2014)",
    powers: ["天神血统", "双枪", "临场指挥"],
    status: "在世",
    accent: "#1e3a6e",
  },
  {
    cn: "卡魔拉",
    en: "Gamora",
    alias: "卡魔拉 / Gamora",
    team: "银河护卫队",
    debut: "《银河护卫队》(2014)",
    powers: ["刺客训练", "超常体术", "战术判断"],
    status: "在世",
    accent: "#3d8b3d",
  },
  {
    cn: "斯科特·朗",
    en: "Scott Lang",
    alias: "蚁人 / Ant-Man",
    team: "复仇者",
    debut: "《蚁人》(2015)",
    powers: ["皮姆粒子", "体型切换", "电子工程"],
    status: "在世",
    accent: "#c8202c",
  },
  {
    cn: "卡罗尔·丹弗斯",
    en: "Carol Danvers",
    alias: "惊奇队长 / Captain Marvel",
    team: "复仇者",
    debut: "《惊奇队长》(2019)",
    powers: ["宇宙能量", "飞行", "超常耐力"],
    status: "在世",
    accent: "#1e3a6e",
  },
  {
    cn: "山姆·威尔逊",
    en: "Sam Wilson",
    alias: "猎鹰 / 美国队长",
    team: "复仇者",
    debut: "《美国队长 2》(2014)",
    powers: ["飞行翼", "盾牌", "空战"],
    status: "在世",
    accent: "#1e3a6e",
  },
  {
    cn: "洛基",
    en: "Loki Laufeyson",
    alias: "洛基 / Loki",
    team: "阿斯加德",
    debut: "《雷神》(2011)",
    powers: ["幻术", "诡计", "时间线管理"],
    status: "在世",
    accent: "#2e7d32",
  },
  {
    cn: "里德·理查兹",
    en: "Reed Richards",
    alias: "神奇先生 / Mr. Fantastic",
    team: "神奇四侠",
    debut: "《神奇四侠：初露锋芒》(2025)",
    powers: ["身体延展", "顶尖智力", "跨维计算"],
    status: "在世",
    accent: "#1d4ed8",
  },
  {
    cn: "苏·斯托姆",
    en: "Sue Storm",
    alias: "隐形女 / Invisible Woman",
    team: "神奇四侠",
    debut: "《神奇四侠：初露锋芒》(2025)",
    powers: ["力场", "隐形", "航空工程"],
    status: "在世",
    accent: "#1d4ed8",
  },
  {
    cn: "强尼·斯托姆",
    en: "Johnny Storm",
    alias: "霹雳火 / Human Torch",
    team: "神奇四侠",
    debut: "《神奇四侠：初露锋芒》(2025)",
    powers: ["控火", "飞行", "高温免疫"],
    status: "在世",
    accent: "#d94a10",
  },
  {
    cn: "本·格林",
    en: "Ben Grimm",
    alias: "石头人 / The Thing",
    team: "神奇四侠",
    debut: "《神奇四侠：初露锋芒》(2025)",
    powers: ["岩石躯体", "超常力量", "重装格斗"],
    status: "在世",
    accent: "#c96a12",
  },
  {
    cn: "韦德·威尔逊",
    en: "Wade Wilson",
    alias: "死侍 / Deadpool",
    team: "独立",
    debut: "《死侍与金刚狼》(2024)",
    powers: ["自愈因子", "双刀", "打破第四面墙"],
    status: "在世",
    accent: "#b3121c",
  },
  {
    cn: "罗根",
    en: "Logan",
    alias: "金刚狼 / Wolverine",
    team: "独立",
    debut: "《死侍与金刚狼》(2024)",
    powers: ["自愈因子", "艾德曼合金爪", "超常感官"],
    status: "在世",
    accent: "#f2c200",
  },
];

/** 按阶段取片单 */
export const filmsOfPhase = (n: number) => films.filter((f) => f.phase === n);

export const releasedCount = films.filter((f) => f.out).length;
export const upcomingCount = films.filter((f) => !f.out).length;

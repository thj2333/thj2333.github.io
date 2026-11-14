/**
 * 别册：不属于 MCU 的漫威改编作品
 * 分为福克斯 X 战警宇宙、索尼蜘蛛侠系、早期单片、漫威电视旧剧集四组。
 */

export type LegacyKind = "电影" | "剧集";

export interface LegacyItem {
  year: number;
  cn: string;
  en: string;
  kind: LegacyKind;
  /** 剧集的季数 */
  seasons?: number;
  /** 是否已公映 / 上线 */
  out: boolean;
  /** 备注标签：动画、未公映、档期待定… */
  note?: string;
}

export interface LegacyGroup {
  id: string;
  label: string;
  en: string;
  note: string;
  accent: string;
  items: LegacyItem[];
}

export const legacyGroups: LegacyGroup[] = [
  {
    id: "fox",
    label: "福克斯 · X 战警宇宙",
    en: "FOX / X-MEN",
    note: "2000 年开启的那条线，止于 2020 年的《新变种人》。",
    accent: "#f2c200",
    items: [
      { year: 2000, cn: "X 战警", en: "X-Men", kind: "电影", out: true },
      { year: 2003, cn: "X 战警 2", en: "X2", kind: "电影", out: true },
      { year: 2006, cn: "X 战警 3：最后之战", en: "X-Men: The Last Stand", kind: "电影", out: true },
      { year: 2009, cn: "X 战警前传：金刚狼", en: "X-Men Origins: Wolverine", kind: "电影", out: true },
      { year: 2011, cn: "X 战警：第一战", en: "X-Men: First Class", kind: "电影", out: true },
      { year: 2013, cn: "金刚狼 2", en: "The Wolverine", kind: "电影", out: true },
      { year: 2014, cn: "X 战警：逆转未来", en: "X-Men: Days of Future Past", kind: "电影", out: true },
      { year: 2016, cn: "死侍", en: "Deadpool", kind: "电影", out: true },
      { year: 2016, cn: "X 战警：天启", en: "X-Men: Apocalypse", kind: "电影", out: true },
      { year: 2017, cn: "金刚狼 3：殊死一战", en: "Logan", kind: "电影", out: true },
      { year: 2018, cn: "死侍 2", en: "Deadpool 2", kind: "电影", out: true },
      { year: 2019, cn: "X 战警：黑凤凰", en: "Dark Phoenix", kind: "电影", out: true },
      { year: 2020, cn: "新变种人", en: "The New Mutants", kind: "电影", out: true },
    ],
  },
  {
    id: "sony",
    label: "索尼 · 蜘蛛侠系列",
    en: "SONY / SPIDER-MAN",
    note: "从 2002 年山姆·雷米那版算起，含动画与蜘蛛侠反派宇宙。",
    accent: "#c8202c",
    items: [
      { year: 2002, cn: "蜘蛛侠", en: "Spider-Man", kind: "电影", out: true },
      { year: 2004, cn: "蜘蛛侠 2", en: "Spider-Man 2", kind: "电影", out: true },
      { year: 2007, cn: "蜘蛛侠 3", en: "Spider-Man 3", kind: "电影", out: true },
      { year: 2012, cn: "超凡蜘蛛侠", en: "The Amazing Spider-Man", kind: "电影", out: true },
      { year: 2014, cn: "超凡蜘蛛侠 2", en: "The Amazing Spider-Man 2", kind: "电影", out: true },
      { year: 2018, cn: "蜘蛛侠：平行宇宙", en: "Into the Spider-Verse", kind: "电影", out: true, note: "动画" },
      { year: 2018, cn: "毒液", en: "Venom", kind: "电影", out: true },
      { year: 2021, cn: "毒液 2：屠杀开始", en: "Venom: Let There Be Carnage", kind: "电影", out: true },
      { year: 2022, cn: "暗夜博士：莫比亚斯", en: "Morbius", kind: "电影", out: true },
      { year: 2023, cn: "蜘蛛侠：纵横宇宙", en: "Across the Spider-Verse", kind: "电影", out: true, note: "动画" },
      { year: 2024, cn: "蜘蛛夫人：超感觉醒", en: "Madame Web", kind: "电影", out: true },
      { year: 2024, cn: "猎人克莱文", en: "Kraven the Hunter", kind: "电影", out: true },
      { year: 2024, cn: "毒液 3：最后一舞", en: "Venom: The Last Dance", kind: "电影", out: true },
      {
        year: 2027,
        cn: "蜘蛛侠：超越宇宙",
        en: "Beyond the Spider-Verse",
        kind: "电影",
        out: false,
        note: "动画 · 档期待定",
      },
    ],
  },
  {
    id: "early",
    label: "早期单片",
    en: "STANDALONE FILMS",
    note: "漫威影业成立之前，散落在各家片厂的改编片。",
    accent: "#6b3fa0",
    items: [
      { year: 1986, cn: "天降神兵", en: "Howard the Duck", kind: "电影", out: true },
      { year: 1989, cn: "惩罚者", en: "The Punisher", kind: "电影", out: true },
      { year: 1990, cn: "美国队长", en: "Captain America", kind: "电影", out: true },
      { year: 1994, cn: "神奇四侠", en: "The Fantastic Four", kind: "电影", out: false, note: "未公映" },
      { year: 1998, cn: "刀锋战士", en: "Blade", kind: "电影", out: true },
      { year: 2002, cn: "刀锋战士 2", en: "Blade II", kind: "电影", out: true },
      { year: 2003, cn: "夜魔侠", en: "Daredevil", kind: "电影", out: true },
      { year: 2004, cn: "惩罚者", en: "The Punisher", kind: "电影", out: true },
      { year: 2004, cn: "刀锋战士 3：三位一体", en: "Blade: Trinity", kind: "电影", out: true },
      { year: 2005, cn: "艾丽卡", en: "Elektra", kind: "电影", out: true },
      { year: 2005, cn: "神奇四侠", en: "Fantastic Four", kind: "电影", out: true },
      { year: 2007, cn: "神奇四侠 2：银影侠来袭", en: "Fantastic Four: Rise of the Silver Surfer", kind: "电影", out: true },
      { year: 2007, cn: "灵魂战车", en: "Ghost Rider", kind: "电影", out: true },
      { year: 2008, cn: "惩罚者 2：战争地带", en: "Punisher: War Zone", kind: "电影", out: true },
      { year: 2011, cn: "灵魂战车 2：复仇时刻", en: "Ghost Rider: Spirit of Vengeance", kind: "电影", out: true },
      { year: 2015, cn: "神奇四侠 2015", en: "Fantastic Four", kind: "电影", out: true, note: "重启版" },
    ],
  },
  {
    id: "tv",
    label: "漫威电视 · 旧剧集",
    en: "MARVEL TELEVISION",
    note: "2013–2020 那批小荧幕作品，正史归属至今仍有争议。",
    accent: "#1f6f8b",
    items: [
      { year: 2013, cn: "神盾局特工", en: "Agents of S.H.I.E.L.D.", kind: "剧集", seasons: 7, out: true },
      { year: 2015, cn: "特工卡特", en: "Agent Carter", kind: "剧集", seasons: 2, out: true },
      { year: 2015, cn: "夜魔侠", en: "Daredevil", kind: "剧集", seasons: 3, out: true },
      { year: 2015, cn: "杰西卡·琼斯", en: "Jessica Jones", kind: "剧集", seasons: 3, out: true },
      { year: 2016, cn: "卢克·凯奇", en: "Luke Cage", kind: "剧集", seasons: 2, out: true },
      { year: 2017, cn: "铁拳", en: "Iron Fist", kind: "剧集", seasons: 2, out: true },
      { year: 2017, cn: "捍卫者联盟", en: "The Defenders", kind: "剧集", seasons: 1, out: true },
      { year: 2017, cn: "惩罚者", en: "The Punisher", kind: "剧集", seasons: 2, out: true },
      { year: 2017, cn: "异人族", en: "Inhumans", kind: "剧集", seasons: 1, out: true },
      { year: 2017, cn: "边境惊魂", en: "Runaways", kind: "剧集", seasons: 3, out: true },
      { year: 2017, cn: "天赋异禀", en: "The Gifted", kind: "剧集", seasons: 2, out: true },
      { year: 2017, cn: "军团", en: "Legion", kind: "剧集", seasons: 3, out: true },
      { year: 2018, cn: "斗篷与匕首", en: "Cloak & Dagger", kind: "剧集", seasons: 2, out: true },
      { year: 2020, cn: "地狱风暴", en: "Helstrom", kind: "剧集", seasons: 1, out: true },
    ],
  },
];

export const legacyTotal = legacyGroups.reduce((n, g) => n + g.items.length, 0);
export const legacyFilms = legacyGroups.reduce(
  (n, g) => n + g.items.filter((i) => i.kind === "电影").length,
  0,
);
export const legacySeries = legacyTotal - legacyFilms;

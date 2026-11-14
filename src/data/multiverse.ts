/**
 * 多元宇宙地图数据
 * 每个宇宙一套地图视觉主题 + 若干地标（坐标是相对地图的百分比）
 */

export type MapTheme = "tactical" | "blueprint" | "orbital" | "atlas";

export interface Landmark {
  name: string;
  en: string;
  x: number;
  y: number;
  kind: string;
  desc: string;
  /** 标签放在点的哪一侧，避免出界 */
  side?: "left" | "right" | "top" | "bottom";
}

export interface Universe {
  id: string;
  code: string;
  name: string;
  en: string;
  tag: string;
  desc: string;
  theme: MapTheme;
  accent: string;
  /** 地图边框上的一行坐标注记 */
  coord: string;
  landmarks: Landmark[];
}

export const universes: Universe[] = [
  {
    id: "u616",
    code: "Earth-616",
    name: "主宇宙",
    en: "PRIME UNIVERSE",
    tag: "漫画正史 · 本刊常驻",
    desc: "一切的原点。复仇者、至尊法师、神盾局与瓦坎达都在这颗地球上，互相看不顺眼但偶尔联手。",
    theme: "tactical",
    accent: "#23e0ff",
    coord: "40.7128° N / 74.0060° W",
    landmarks: [
      {
        name: "复仇者大厦",
        en: "Avengers Tower",
        x: 27,
        y: 34,
        kind: "据点",
        desc: "曼哈顿中城，斯塔克工业顶层。改过名字、炸过几次，还是那栋楼。",
        side: "right",
      },
      {
        name: "至尊圣所",
        en: "Sanctum Sanctorum",
        x: 22,
        y: 56,
        kind: "秘术",
        desc: "格林威治村布里克街 177A。看着是栋旧楼，里面比外面大。",
        side: "right",
      },
      {
        name: "神盾局总部",
        en: "S.H.I.E.L.D. Triskelion",
        x: 36,
        y: 47,
        kind: "机构",
        desc: "三叉戟大楼。后来被九头蛇从内部吃掉，又重新长回来。",
        side: "right",
      },
      {
        name: "瓦坎达",
        en: "Wakanda",
        x: 62,
        y: 62,
        kind: "国度",
        desc: "东非的振金王国。地图上标的是首都，实际入口在瀑布后面。",
        side: "right",
      },
      {
        name: "地狱厨房",
        en: "Hell's Kitchen",
        x: 24,
        y: 43,
        kind: "街区",
        desc: "夜魔侠的地盘。全城最吵的街区，也是最少有人被冤枉的地方。",
        side: "left",
      },
    ],
  },
  {
    id: "u199999",
    code: "Earth-199999",
    name: "MCU 宇宙",
    en: "CINEMATIC UNIVERSE",
    tag: "电影正史 · 隔壁那条分支",
    desc: "本刊设定里「隔壁」那个宇宙。所有的片子都在这儿，地图按轨道站视角画的。",
    theme: "orbital",
    accent: "#7fb2ff",
    coord: "ORBIT / 51.5074° N",
    landmarks: [
      {
        name: "复仇者基地",
        en: "Avengers Compound",
        x: 30,
        y: 38,
        kind: "据点",
        desc: "纽约州北部。终局之战的主战场，现在归新复联用。",
        side: "right",
      },
      {
        name: "卡玛泰姬",
        en: "Kamar-Taj",
        x: 63,
        y: 30,
        kind: "秘术",
        desc: "喜马拉雅山里。奇异博士在这里从外科医生变成法师。",
        side: "left",
      },
      {
        name: "天剑局轨道站",
        en: "S.W.O.R.D. Station",
        x: 74,
        y: 52,
        kind: "机构",
        desc: "Sentient World Observation and Response Department。地球的太空哨站。",
        side: "left",
      },
      {
        name: "新阿斯加德",
        en: "New Asgard",
        x: 45,
        y: 46,
        kind: "国度",
        desc: "挪威那个小渔村。阿斯加德难民区，现在是个旅游景点。",
        side: "right",
      },
      {
        name: "塔罗村",
        en: "Ta Lo",
        x: 78,
        y: 72,
        kind: "秘境",
        desc: "十环的另一端。普通人走不进去，得知道路。",
        side: "left",
      },
    ],
  },
  {
    id: "u838",
    code: "Earth-838",
    name: "光照会宇宙",
    en: "ILLUMINATI UNIVERSE",
    tag: "秩序宇宙 · 圆桌统治",
    desc: "一切都太整齐了。这里没有散兵游勇，只有一个坐在圆桌旁的委员会替全人类做决定。",
    theme: "blueprint",
    accent: "#8b6b2e",
    coord: "SECTOR 838 / SYMMETRIC",
    landmarks: [
      {
        name: "光照会总部",
        en: "Illuminati Headquarters",
        x: 50,
        y: 50,
        kind: "机构",
        desc: "地图正中央——它本来就是这张图的中心。圆桌六席，话事权按席位排。",
        side: "bottom",
      },
      {
        name: "巴克斯特基金会",
        en: "Baxter Foundation",
        x: 27,
        y: 32,
        kind: "据点",
        desc: "838 的神奇先生在这儿做跨维研究，规矩比才华多。",
        side: "right",
      },
      {
        name: "至尊圣所 838",
        en: "Sanctum Sanctorum",
        x: 71,
        y: 36,
        kind: "秘术",
        desc: "这版的圣所玻璃擦得更亮，守卫的代价也更大。",
        side: "left",
      },
      {
        name: "阿提兰",
        en: "Attilan",
        x: 66,
        y: 74,
        kind: "秘境",
        desc: "异人族的月城。黑蝠王从这里上线，一句话就能平一座城。",
        side: "left",
      },
    ],
  },
  {
    id: "u10005",
    code: "Earth-10005",
    name: "X 战警宇宙",
    en: "MUTANT UNIVERSE",
    tag: "变种人 · 旧地图",
    desc: "一张 2000 年印的图，边角已经卷了。变种人在这里不是英雄，是议题。",
    theme: "atlas",
    accent: "#b3121c",
    coord: "MUTANT ATLAS / 1963—2029",
    landmarks: [
      {
        name: "泽维尔天才少年学校",
        en: "Xavier's School for Gifted Youngsters",
        x: 33,
        y: 40,
        kind: "据点",
        desc: "塞勒姆中心的寄宿学校。白天上课，晚上练怎么打回去。",
        side: "right",
      },
      {
        name: "基诺沙岛",
        en: "Genosha",
        x: 72,
        y: 62,
        kind: "国度",
        desc: "变种人避难国。建起来要几十年，抹掉只要几分钟。",
        side: "left",
      },
      {
        name: "碱湖基地",
        en: "Alkali Lake",
        x: 18,
        y: 66,
        kind: "禁区",
        desc: "地下设施。金刚狼的来路和艾德曼合金都在这儿打出来的。",
        side: "right",
      },
      {
        name: "黑鸟号机库",
        en: "Blackbird Hangar",
        x: 41,
        y: 55,
        kind: "载具",
        desc: "学校地下的机库。一架隐身改型 SR-71，学生们叫它校车。",
        side: "right",
      },
    ],
  },
];

export const totalLandmarks = universes.reduce((n, u) => n + u.landmarks.length, 0);

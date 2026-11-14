export type ToolStatus = "online" | "beta" | "archived";

export interface Tool {
  name: string;
  code: string;
  desc: string;
  href: string;
  tag: string;
  status: ToolStatus;
}

export const tools: Tool[] = [
  {
    name: "Paper 阅读器",
    code: "TK-001",
    desc: "PDF 论文按段落精读，自动抽公式与图表，支持双栏对照。",
    href: "#",
    tag: "科研",
    status: "online",
  },
  {
    name: "NeRF 训练台",
    code: "TK-002",
    desc: "一键拉起 nerf-pytorch 实验，记录 loss 曲线与渲染采样。",
    href: "#",
    tag: "视觉",
    status: "beta",
  },
  {
    name: "计组刷题器",
    code: "TK-003",
    desc: "Cache 映射、流水线冲突、指令周期，按知识点随机出题。",
    href: "#",
    tag: "课程",
    status: "online",
  },
  {
    name: "Markdown 排版器",
    code: "TK-004",
    desc: "给本刊写稿用的排版工具，一行命令出分格版面。",
    href: "#",
    tag: "写作",
    status: "online",
  },
  {
    name: "3D 数据集整理",
    code: "TK-005",
    desc: "ShapeNet / ScanNet 批量转格式、切分与可视化预览。",
    href: "#",
    tag: "数据",
    status: "archived",
  },
];

export const statusLabel: Record<ToolStatus, string> = {
  online: "运行中",
  beta: "测试中",
  archived: "已归档",
};

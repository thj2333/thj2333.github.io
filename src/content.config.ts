import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    cat: z.enum(["cinema", "tools", "research", "music", "travel", "whatif"]).default("tools"),
    excerpt: z.string(),
    issue: z.number(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** 持续更新：卡片与文章页会挂一个角标 */
    updated: z.boolean().default(false),
    /** 版面通栏：数据密集的文章用 */
    wide: z.boolean().default(false),
  }),
});

/** 工具文档：目前挂在 /armory 对应工具卡片里 */
const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    /** 关联的工具名，例如 "Jarvis" */
    tool: z.string(),
    summary: z.string().default(""),
    /** 同一工具下的功能顺序 */
    order: z.number().default(0),
    updated: z.string().optional(),
  }),
});

export const collections = { blog, docs };

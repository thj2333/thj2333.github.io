import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string().default("未分类"),
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

export const collections = { blog };

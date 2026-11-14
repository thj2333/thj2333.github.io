#!/usr/bin/env node
/**
 * 本地博客编辑器
 * 左边实时预览、右边 Markdown 源码；双击预览可跳到对应源码行。
 *
 * 用法：
 *   npm run editor          # 默认 http://127.0.0.1:4400
 *   PORT=4500 npm run editor
 *
 * 它直接读写 src/content/blog/*.md(x)，保存后 Astro dev server 会自动热更新。
 */

import { createServer } from "node:http";
import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const BLOG_DIR = path.join(ROOT, "src", "content", "blog");
const PUBLIC_DIR = path.join(__dirname, "public");
const DIST_CSS_DIR = path.join(ROOT, "dist", "_astro");
const PORT = Number(process.env.PORT || 4400);

/* ---------------- Markdown 渲染（带源码行号映射） ---------------- */

const md = new MarkdownIt({ html: true, linkify: true });

const baseRenderToken = md.renderer.renderToken.bind(md.renderer);
md.renderer.renderToken = (tokens, idx, options) => {
  const token = tokens[idx];
  // map 是 [起始行, 结束行)，相对传给 md.render 的字符串
  if (token.map && token.block) {
    token.attrSet("data-line", String(token.map[0]));
    token.attrSet("data-endline", String(token.map[1]));
  }
  return baseRenderToken(tokens, idx, options);
};

/** 分离 frontmatter，返回正文与正文起始行偏移 */
function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { fm: "", body: raw, offset: 0, meta: {} };
  const offset = (m[0].match(/\n/g) || []).length;
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { fm: m[0], body: raw.slice(m[0].length), offset, meta };
}

function renderMarkdown(raw) {
  const { body, offset, meta } = splitFrontmatter(raw);
  const tokens = md.parse(body, {});
  if (offset > 0) {
    for (const t of tokens) {
      if (t.map) t.map = [t.map[0] + offset, t.map[1] + offset];
    }
  }
  const html = md.renderer.render(tokens, md.options, {});
  return { html, meta, offset };
}

/* ---------------- 站点 CSS（复用构建产物，预览才像真的） ---------------- */

let cssCache = { mtime: 0, css: null };

async function siteCss() {
  try {
    const files = (await readdir(DIST_CSS_DIR)).filter((f) => f.endsWith(".css"));
    let newest = 0;
    const candidates = [];
    for (const f of files) {
      const p = path.join(DIST_CSS_DIR, f);
      const st = await stat(p);
      newest = Math.max(newest, st.mtimeMs);
      candidates.push({ p, mtime: st.mtimeMs });
    }
    if (cssCache.css && cssCache.mtime === newest) return cssCache.css;
    candidates.sort((a, b) => b.mtime - a.mtime);
    for (const c of candidates) {
      const css = await readFile(c.p, "utf8");
      if (css.includes(".prose-616")) {
        cssCache = { mtime: newest, css };
        return css;
      }
    }
    if (candidates[0]) {
      const css = await readFile(candidates[0].p, "utf8");
      cssCache = { mtime: newest, css };
      return css;
    }
  } catch {
    /* dist 还没构建 */
  }
  return null;
}

/* ---------------- 工具函数 ---------------- */

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8",
};

const json = (res, code, data) => {
  const body = JSON.stringify(data);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > 4 * 1024 * 1024) {
        reject(new Error("payload too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });

/** 只允许编辑 content/blog 下的文件 */
function safeBlogPath(file) {
  if (typeof file !== "string" || !file) return null;
  if (!/\.(md|mdx)$/i.test(file)) return null;
  const abs = path.resolve(BLOG_DIR, file);
  const rel = path.relative(BLOG_DIR, abs);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  return abs;
}

async function listPosts() {
  const files = await readdir(BLOG_DIR);
  const posts = [];
  for (const f of files) {
    if (!/\.(md|mdx)$/i.test(f)) continue;
    const abs = path.join(BLOG_DIR, f);
    const st = await stat(abs);
    const raw = await readFile(abs, "utf8");
    const { meta } = splitFrontmatter(raw);
    posts.push({
      file: f,
      title: meta.title || f,
      issue: Number(meta.issue || 0),
      cat: meta.cat || "tools",
      updated: meta.updated === "true",
      bytes: st.size,
      mtime: st.mtimeMs,
    });
  }
  posts.sort((a, b) => b.issue - a.issue || a.title.localeCompare(b.title));
  return posts;
}

/* ---------------- HTTP ---------------- */

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);

  try {
    /* --- API --- */
    if (pathname === "/api/posts" && req.method === "GET") {
      return json(res, 200, { posts: await listPosts() });
    }

    if (pathname === "/api/post" && req.method === "GET") {
      const abs = safeBlogPath(url.searchParams.get("file"));
      if (!abs) return json(res, 400, { error: "bad file" });
      const raw = await readFile(abs, "utf8");
      return json(res, 200, { file: path.basename(abs), raw });
    }

    if (pathname === "/api/render" && req.method === "POST") {
      const body = JSON.parse(await readBody(req));
      if (typeof body.content !== "string") {
        return json(res, 400, { error: "content required" });
      }
      const out = renderMarkdown(body.content);
      return json(res, 200, out);
    }

    if (pathname === "/api/save" && req.method === "POST") {
      const body = JSON.parse(await readBody(req));
      const abs = safeBlogPath(body.file);
      if (!abs) return json(res, 400, { error: "bad file" });
      if (typeof body.content !== "string") {
        return json(res, 400, { error: "content required" });
      }
      await writeFile(abs, body.content, "utf8");
      const st = await stat(abs);
      console.log(`[editor] saved ${path.basename(abs)} (${st.size} B)`);
      return json(res, 200, { ok: true, mtime: st.mtimeMs, bytes: st.size });
    }

    if (pathname === "/site.css") {
      const css = await siteCss();
      if (!css) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("/* dist 还没构建，预览将使用内置的降级样式 */");
      }
      res.writeHead(200, {
        "Content-Type": "text/css; charset=utf-8",
        "Cache-Control": "no-store",
      });
      return res.end(css);
    }

    if (pathname === "/api/health") {
      const css = await siteCss();
      return json(res, 200, {
        ok: true,
        blogDir: BLOG_DIR,
        siteCss: Boolean(css),
      });
    }

    /* --- 静态文件 --- */
    const rel = pathname === "/" ? "/index.html" : pathname;
    const file = path.resolve(PUBLIC_DIR, "." + rel);
    if (!file.startsWith(PUBLIC_DIR)) {
      res.writeHead(403);
      return res.end("forbidden");
    }
    const data = await readFile(file);
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  } catch (err) {
    if (err?.code === "ENOENT") {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404");
    }
    console.error("[editor]", err);
    json(res, 500, { error: String(err?.message || err) });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\n  616 blog editor  →  http://127.0.0.1:${PORT}`);
  console.log(`  编辑目录          →  ${BLOG_DIR}`);
  console.log(`  预览样式          →  dist/_astro（先 npm run build 才有真实排版）\n`);
});

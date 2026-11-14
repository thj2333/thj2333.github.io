#!/usr/bin/env node
/**
 * Jarvis · 站点控制台
 * 一个功能：可视化编辑整个站点源码。
 *   - 左：文件树 / 中：预览（Markdown 实时渲染） / 右：源码
 *   - 双击 Markdown 预览可跳到源码对应行
 *
 * 用法：
 *   npm run editor          # http://127.0.0.1:4400
 *   PORT=4500 npm run editor
 */

import { createServer } from "node:http";
import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const PUBLIC_DIR = path.join(__dirname, "public");
const DIST_CSS_DIR = path.join(ROOT, "dist", "_astro");
const PORT = Number(process.env.PORT || 4400);
const SITE_PORT = Number(process.env.SITE_PORT || 4321);

/** 允许编辑的顶层目录 / 根文件 */
const ALLOWED_TOP_DIRS = new Set(["src", "public", "tools", "docs", ".github"]);
const ALLOWED_ROOT_FILES = new Set([
  "astro.config.mjs",
  "tsconfig.json",
  "package.json",
  "README.md",
]);

/** 可编辑的文本扩展名 */
const TEXT_EXT = new Set([
  ".md",
  ".mdx",
  ".astro",
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".css",
  ".json",
  ".yaml",
  ".yml",
  ".html",
  ".svg",
  ".txt",
  ".toml",
]);

const DENY_NAMES = new Set([
  "node_modules",
  "dist",
  ".astro",
  ".git",
  "_backup",
  ".npm-cache",
  ".DS_Store",
]);

const MAX_BYTES = 1024 * 1024;
const exec = promisify(execFile);

/* ---------------- Markdown ---------------- */

const md = new MarkdownIt({ html: true, linkify: true });

const baseRenderToken = md.renderer.renderToken.bind(md.renderer);
md.renderer.renderToken = (tokens, idx, options) => {
  const token = tokens[idx];
  if (token.map && token.block) {
    token.attrSet("data-line", String(token.map[0]));
    token.attrSet("data-endline", String(token.map[1]));
  }
  return baseRenderToken(tokens, idx, options);
};

function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { body: raw, offset: 0, meta: {} };
  const offset = (m[0].match(/\n/g) || []).length;
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { body: raw.slice(m[0].length), offset, meta };
}

function renderMarkdown(raw) {
  const { body, offset, meta } = splitFrontmatter(raw);
  const tokens = md.parse(body, {});
  if (offset > 0) {
    for (const t of tokens) {
      if (t.map) t.map = [t.map[0] + offset, t.map[1] + offset];
    }
  }
  return { html: md.renderer.render(tokens, md.options, {}), meta, offset };
}

/* ---------------- 站点 CSS ---------------- */

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
  } catch {
    /* 还没构建 */
  }
  return null;
}

/* ---------------- 路径安全 ---------------- */

function safePath(rel) {
  if (typeof rel !== "string" || !rel) return null;
  const abs = path.resolve(ROOT, rel);
  const relFromRoot = path.relative(ROOT, abs);
  if (relFromRoot.startsWith("..") || path.isAbsolute(relFromRoot)) return null;
  if (!relFromRoot) return null;

  const segments = relFromRoot.split(path.sep);
  for (const seg of segments) {
    if (DENY_NAMES.has(seg)) return null;
  }
  if (segments.some((s) => s.startsWith(".") && s !== ".github")) return null;

  if (segments.length === 1) {
    if (!ALLOWED_ROOT_FILES.has(segments[0])) return null;
  } else if (!ALLOWED_TOP_DIRS.has(segments[0])) {
    return null;
  }

  if (!TEXT_EXT.has(path.extname(relFromRoot).toLowerCase())) return null;
  return { abs, rel: relFromRoot.split(path.sep).join("/") };
}

/* ---------------- 文件树 ---------------- */

async function walk(dir, depth = 0, out = []) {
  if (depth > 7) return out;
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (DENY_NAMES.has(e.name)) continue;
    if (e.name.startsWith(".") && e.name !== ".github") continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walk(abs, depth + 1, out);
    } else if (TEXT_EXT.has(path.extname(e.name).toLowerCase())) {
      const st = await stat(abs).catch(() => null);
      if (st && st.size <= MAX_BYTES) {
        out.push({
          path: path.relative(ROOT, abs).split(path.sep).join("/"),
          size: st.size,
        });
      }
    }
  }
  return out;
}

async function fileTree() {
  const out = [];
  for (const dir of ALLOWED_TOP_DIRS) {
    await walk(path.join(ROOT, dir), 0, out);
  }
  for (const f of ALLOWED_ROOT_FILES) {
    const abs = path.join(ROOT, f);
    const st = await stat(abs).catch(() => null);
    if (st) out.push({ path: f, size: st.size });
  }
  out.sort((a, b) => a.path.localeCompare(b.path));
  return out;
}

/* ---------------- Git ---------------- */

async function git(args, opts = {}) {
  const { stdout, stderr } = await exec("git", args, {
    cwd: ROOT,
    maxBuffer: 16 * 1024 * 1024,
    ...opts,
  });
  return (stdout || stderr || "").trim();
}

/** 不做 trim 的版本：porcelain 输出首行带前导空格，trim 会把状态位吃掉 */
async function gitRaw(args, opts = {}) {
  try {
    const { stdout } = await exec("git", args, {
      cwd: ROOT,
      maxBuffer: 16 * 1024 * 1024,
      ...opts,
    });
    return stdout;
  } catch {
    return "";
  }
}

async function gitTry(args, opts = {}) {
  try {
    return await git(args, opts);
  } catch {
    return "";
  }
}

/** 提交身份：优先用仓库配置，没有就退回默认值 */
async function gitIdentity() {
  const name = await gitTry(["config", "user.name"]);
  const email = await gitTry(["config", "user.email"]);
  return {
    name: name || "thj2333",
    email: email || "thj2333@users.noreply.github.com",
    fromRepo: Boolean(name && email),
  };
}

async function gitStatus() {
  const branch = (await gitTry(["rev-parse", "--abbrev-ref", "HEAD"])) || "—";
  const remote = await gitTry(["remote", "get-url", "origin"]);
  const identity = await gitIdentity();

  const real = branch !== "—";
  const remoteDefault = (await gitTry([
    "symbolic-ref",
    "--short",
    "refs/remotes/origin/HEAD",
  ])).replace(/^origin\//, "");

  let ahead = 0;
  let behind = 0;
  if (real && remote) {
    // 优先比对同名远端分支，否则退回远端默认分支
    const sameName = await gitTry(["rev-parse", "--verify", "--quiet", `origin/${branch}`]);
    const cmpRef = sameName ? `origin/${branch}` : remoteDefault ? `origin/${remoteDefault}` : "";
    if (cmpRef) {
      const counts = await gitTry(["rev-list", "--left-right", "--count", `${cmpRef}...HEAD`]);
      if (counts) {
        const [b, a] = counts.split(/\s+/).map(Number);
        behind = b || 0;
        ahead = a || 0;
      }
    }
  }

  let files = [];
  if (real) {
    const porcelain = await gitRaw(["status", "--porcelain=v1", "-uall"]);
    const numstat = await gitTry(["diff", "--numstat", "HEAD"]);
    const stats = new Map();
    for (const line of numstat.split("\n").filter(Boolean)) {
      const [add, del, file] = line.split("\t");
      if (file) stats.set(file, { add: Number(add) || 0, del: Number(del) || 0 });
    }
    files = porcelain
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const code = line.slice(0, 2).trim();
        const p = line.slice(3).trim();
        const cleanPath = p.includes(" -> ") ? p.split(" -> ").pop() : p;
        return {
          code,
          path: cleanPath,
          staged: line[0] !== " " && line[0] !== "?",
          stat: stats.get(cleanPath) || null,
        };
      });
  }

  const log = real
    ? (await gitTry(["log", "-5", "--pretty=format:%h|%s|%ad", "--date=short"]))
        .split("\n")
        .filter(Boolean)
        .map((l) => {
          const [hash, subject, date] = l.split("|");
          return { hash, subject, date };
        })
    : [];

  return {
    root: ROOT,
    branch,
    remoteDefault,
    remote,
    remoteOwner: remote.match(/github\.com[:/]([^/]+)\/([^/.]+)/)?.[1] || null,
    remoteRepo: remote.match(/github\.com[:/]([^/]+)\/([^/.]+)/)?.[2] || null,
    ahead,
    behind,
    files,
    log,
    identity,
    initialized: real,
  };
}

/* ---------------- HTTP 工具 ---------------- */

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8",
};

const json = (res, code, data) => {
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
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

/* ---------------- 路由 ---------------- */

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);

  try {
    if (pathname === "/api/tree" && req.method === "GET") {
      return json(res, 200, { root: ROOT, files: await fileTree() });
    }

    if (pathname === "/api/file" && req.method === "GET") {
      const target = safePath(url.searchParams.get("path"));
      if (!target) return json(res, 400, { error: "bad path" });
      const raw = await readFile(target.abs, "utf8");
      const st = await stat(target.abs);
      return json(res, 200, {
        path: target.rel,
        content: raw,
        size: st.size,
        mtime: st.mtimeMs,
      });
    }

    if (pathname === "/api/save" && req.method === "POST") {
      const body = JSON.parse(await readBody(req));
      const target = safePath(body.path);
      if (!target) return json(res, 400, { error: "bad path" });
      if (typeof body.content !== "string") {
        return json(res, 400, { error: "content required" });
      }
      await writeFile(target.abs, body.content, "utf8");
      const st = await stat(target.abs);
      console.log(`[jarvis] saved ${target.rel} (${st.size} B)`);
      return json(res, 200, { ok: true, mtime: st.mtimeMs, size: st.size });
    }

    if (pathname === "/api/render" && req.method === "POST") {
      const body = JSON.parse(await readBody(req));
      if (typeof body.content !== "string") {
        return json(res, 400, { error: "content required" });
      }
      return json(res, 200, renderMarkdown(body.content));
    }

    if (pathname === "/site.css") {
      const css = await siteCss();
      if (!css) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("/* dist 还没构建 */");
      }
      res.writeHead(200, {
        "Content-Type": "text/css; charset=utf-8",
        "Cache-Control": "no-store",
      });
      return res.end(css);
    }

    if (pathname === "/api/health") {
      return json(res, 200, {
        ok: true,
        root: ROOT,
        sitePort: SITE_PORT,
        siteCss: Boolean(await siteCss()),
        files: (await fileTree()).length,
      });
    }

    /* ---- Git ---- */

    if (pathname === "/api/git/status" && req.method === "GET") {
      return json(res, 200, await gitStatus());
    }

    if (pathname === "/api/git/commit" && req.method === "POST") {
      const body = JSON.parse(await readBody(req));
      const message = String(body.message || "").trim();
      if (!message) return json(res, 400, { error: "提交信息不能为空" });

      const status = await gitStatus();
      if (!status.initialized) {
        return json(res, 400, { error: "当前目录不是 git 仓库" });
      }
      if (!status.files.length) {
        return json(res, 400, { error: "没有可提交的改动" });
      }

      const id = await gitIdentity();
      await git(["add", "-A"]);
      const args = [
        "-c",
        `user.name=${id.name}`,
        "-c",
        `user.email=${id.email}`,
        "commit",
        "-m",
        message,
      ];
      const out = await git(args);
      console.log(`[jarvis] commit: ${message}`);
      return json(res, 200, { ok: true, output: out, status: await gitStatus() });
    }

    if (pathname === "/api/git/push" && req.method === "POST") {
      const status = await gitStatus();
      if (!status.remote) {
        return json(res, 400, { error: "还没有配置远程仓库" });
      }
      const out = await exec(
        "git",
        ["push", "-u", "origin", status.branch],
        { cwd: ROOT, maxBuffer: 16 * 1024 * 1024 },
      ).then(
        (r) => (r.stdout + r.stderr).trim(),
        (e) => {
          throw new Error((e.stderr || e.message || "").trim() || "push 失败");
        },
      );
      console.log(`[jarvis] push → ${status.branch}`);
      return json(res, 200, { ok: true, output: out, status: await gitStatus() });
    }

    if (pathname === "/api/git/remote" && req.method === "POST") {
      const body = JSON.parse(await readBody(req));
      let url = String(body.url || "").trim();
      // 允许结尾的 / 与可选的 .git
      url = url.replace(/\/+$/, "");
      if (!/^(https:\/\/github\.com\/|git@github\.com:)[\w.\-]+\/[\w.\-]+?(\.git)?$/.test(url)) {
        return json(res, 400, {
          error: "只接受 GitHub 仓库地址，例如 https://github.com/user/repo（.git 可省略）",
        });
      }
      // https 地址补上 .git，省得后面 push 时再校验
      if (url.startsWith("https://") && !url.endsWith(".git")) url += ".git";
      const existing = await gitTry(["remote", "get-url", "origin"]);
      if (existing) {
        await git(["remote", "set-url", "origin", url]);
      } else {
        await git(["remote", "add", "origin", url]);
      }
      console.log(`[jarvis] remote origin → ${url}`);
      return json(res, 200, { ok: true, status: await gitStatus() });
    }

    if (pathname === "/api/git/build" && req.method === "POST") {
      const cache =
        process.env.npm_config_cache ||
        (existsSync(path.resolve(ROOT, "../.npm-cache"))
          ? path.resolve(ROOT, "../.npm-cache")
          : undefined);
      const env = { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" };
      if (cache) env.npm_config_cache = cache;
      try {
        const { stdout, stderr } = await exec("npm", ["run", "build"], {
          cwd: ROOT,
          env,
          maxBuffer: 32 * 1024 * 1024,
          timeout: 240000,
        });
        const output = (stdout + "\n" + stderr).trim();
        console.log("[jarvis] build ok");
        return json(res, 200, { ok: true, output: output.split("\n").slice(-40).join("\n") });
      } catch (e) {
        const output = ((e.stdout || "") + "\n" + (e.stderr || "")).trim();
        console.log("[jarvis] build failed");
        return json(res, 200, {
          ok: false,
          output: (output || e.message || "构建失败").split("\n").slice(-40).join("\n"),
        });
      }
    }

    /* 静态 */
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
    console.error("[jarvis]", err);
    json(res, 500, { error: String(err?.message || err) });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\n  Jarvis · 站点控制台  →  http://127.0.0.1:${PORT}`);
  console.log(`  可编辑范围            →  src / public / tools / docs / 根配置文件`);
  console.log(`  本地站点              →  http://127.0.0.1:${SITE_PORT}\n`);
});

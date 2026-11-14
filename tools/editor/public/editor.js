/* 616 blog editor — 前端逻辑 */

const $ = (sel) => document.querySelector(sel);

const els = {
  select: $("#post-select"),
  code: $("#code"),
  gutter: $("#gutter"),
  preview: $("#preview"),
  status: $("#status"),
  save: $("#save"),
  meta: $("#meta"),
  count: $("#count"),
  split: $("#split"),
  divider: $("#divider"),
};

const CAT_LABEL = {
  cinema: "IP 电影",
  tools: "实用工具",
  research: "技术研究",
  music: "音乐鉴赏",
  travel: "旅游美食",
  whatif: "假如",
};

const state = {
  file: null,
  saved: "",
  posts: [],
  dirty: false,
  ready: false,
  pending: null,
  lastLine: 1,
  renderSeq: 0,
};

const LINE_HEIGHT = 21;

/* ---------------- 工具 ---------------- */

function setStatus(text, kind = "") {
  els.status.textContent = text;
  els.status.className = "status" + (kind ? " " + kind : "");
}

function markDirty(dirty) {
  state.dirty = dirty;
  els.save.disabled = !dirty || !state.file;
  if (dirty) {
    setStatus("未保存更改", "dirty");
  }
}

function updateCounts() {
  const value = els.code.value;
  const lines = value.split("\n").length;
  const chars = value.length;
  els.count.textContent = `${lines} 行 · ${chars.toLocaleString()} 字符`;
  els.gutter.textContent = Array.from({ length: lines }, (_, i) => i + 1).join("\n");
}

function syncGutter() {
  els.gutter.scrollTop = els.code.scrollTop;
}

/* ---------------- 预览 ---------------- */

function sendHtml(html) {
  state.pending = html;
  if (!state.ready) return;
  els.preview.contentWindow.postMessage({ type: "html", html }, "*");
}

const escapeHtml = (str) =>
  String(str).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function previewHeader(meta) {
  if (!meta || !meta.title) return "";
  const cat = CAT_LABEL[meta.cat] || meta.cat || "";
  const issue = meta.issue ? `#${String(meta.issue).padStart(3, "0")}` : "";
  const badge = meta.updated === "true" ? `<span class="ed-badge">持续更新</span>` : "";
  return `<div class="ed-head">
    <div class="ed-kicker">${issue}${cat ? ` · ${escapeHtml(cat)}` : ""} ${badge}</div>
    <h1 class="ed-title">${escapeHtml(meta.title)}</h1>
    <div class="ed-rule"></div>
  </div>`;
}

async function render() {
  const seq = ++state.renderSeq;
  try {
    const res = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: els.code.value }),
    });
    if (!res.ok) throw new Error(`render ${res.status}`);
    const data = await res.json();
    if (seq !== state.renderSeq) return; // 丢弃过期结果
    sendHtml(previewHeader(data.meta) + data.html);
  } catch (err) {
    setStatus(`预览失败：${err.message}`, "dirty");
  }
}

let renderTimer = null;
function scheduleRender() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(render, 220);
}

/* ---------------- 跳转与高亮 ---------------- */

function lineStartOffset(lines, line) {
  let offset = 0;
  for (let i = 0; i < Math.min(line - 1, lines.length); i++) {
    offset += lines[i].length + 1;
  }
  return offset;
}

function jumpToLine(line, endline) {
  const lines = els.code.value.split("\n");
  const startLine = Math.max(1, Math.min(line, lines.length));
  const endLine = Math.max(startLine, Math.min(endline || startLine, lines.length));

  const start = lineStartOffset(lines, startLine);
  const end = lineStartOffset(lines, endLine) + (lines[endLine - 1]?.length || 0);

  els.code.focus();
  els.code.setSelectionRange(start, end);

  const targetTop = (startLine - 1) * LINE_HEIGHT - LINE_HEIGHT * 3;
  els.code.scrollTop = Math.max(0, targetTop);
  syncGutter();

  els.code.dispatchEvent(new Event("scroll"));
  setStatus(`已定位到第 ${startLine} 行`, "saved");
  setTimeout(() => {
    if (state.dirty) setStatus("未保存更改", "dirty");
  }, 1600);
}

function lineAtCaret() {
  const before = els.code.value.slice(0, els.code.selectionStart);
  return before.split("\n").length;
}

function highlightInPreview() {
  if (!state.ready) return;
  const line = lineAtCaret();
  state.lastLine = line;
  els.preview.contentWindow.postMessage({ type: "highlight", line }, "*");
}

/* ---------------- 加载与保存 ---------------- */

async function loadPosts() {
  const res = await fetch("/api/posts");
  const data = await res.json();
  state.posts = data.posts || [];

  els.select.innerHTML = "";
  for (const p of state.posts) {
    const opt = document.createElement("option");
    opt.value = p.file;
    const cat = CAT_LABEL[p.cat] || p.cat;
    opt.textContent = `#${String(p.issue).padStart(3, "0")} · ${p.title} — ${cat}`;
    els.select.appendChild(opt);
  }
}

function paintMeta() {
  const post = state.posts.find((p) => p.file === state.file);
  if (!post) {
    els.meta.innerHTML = "";
    return;
  }
  const cat = CAT_LABEL[post.cat] || post.cat;
  els.meta.innerHTML = [
    `<span>#${String(post.issue).padStart(3, "0")}</span>`,
    `<span>${cat}</span>`,
    post.updated ? `<span style="color:#f2a900">持续更新</span>` : "",
  ]
    .filter(Boolean)
    .join("");
}

async function loadPost(file) {
  if (!file) return;
  setStatus("加载中…");
  const res = await fetch("/api/post?file=" + encodeURIComponent(file));
  if (!res.ok) {
    setStatus("读取失败", "dirty");
    return;
  }
  const data = await res.json();
  state.file = data.file || file;
  els.code.value = data.raw;
  state.saved = data.raw;
  state.dirty = false;
  els.save.disabled = true;
  els.select.value = state.file;
  updateCounts();
  syncGutter();
  paintMeta();
  await render();
  setStatus("已加载", "saved");
  try {
    localStorage.setItem("e616:editor:last", state.file);
  } catch {
    /* noop */
  }
}

async function save() {
  if (!state.file) return;
  els.save.disabled = true;
  setStatus("保存中…");
  try {
    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: state.file, content: els.code.value }),
    });
    if (!res.ok) throw new Error(`save ${res.status}`);
    const data = await res.json();
    state.saved = els.code.value;
    markDirty(false);
    const t = new Date(data.mtime || Date.now());
    setStatus(
      `已保存 ${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`,
      "saved",
    );
  } catch (err) {
    markDirty(true);
    setStatus(`保存失败：${err.message}`, "dirty");
  }
}

/* ---------------- 事件 ---------------- */

els.code.addEventListener("input", () => {
  updateCounts();
  markDirty(els.code.value !== state.saved);
  scheduleRender();
});

els.code.addEventListener("scroll", syncGutter);

for (const evt of ["click", "keyup", "focus"]) {
  els.code.addEventListener(evt, highlightInPreview);
}

els.save.addEventListener("click", save);

els.select.addEventListener("change", () => {
  if (state.dirty && !confirm("当前修改还没保存，确定切换文章？")) {
    els.select.value = state.file || "";
    return;
  }
  loadPost(els.select.value);
});

window.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    if (state.dirty) save();
  }
});

window.addEventListener("beforeunload", (e) => {
  if (state.dirty) {
    e.preventDefault();
    e.returnValue = "";
  }
});

window.addEventListener("message", (e) => {
  const d = e.data || {};
  if (d.type === "ready") {
    state.ready = true;
    if (state.pending) {
      els.preview.contentWindow.postMessage({ type: "html", html: state.pending }, "*");
    }
    return;
  }
  if (d.type === "locate") {
    jumpToLine(d.line, d.endline);
  }
});

/* ---------------- 分栏拖拽 ---------------- */

(() => {
  let dragging = false;

  const onMove = (e) => {
    if (!dragging) return;
    const rect = els.split.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(80, Math.max(24, pct));
    els.split.style.setProperty("--left", clamped + "%");
  };

  const stop = () => {
    dragging = false;
    els.divider.classList.remove("dragging");
    document.body.style.cursor = "";
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", stop);
  };

  els.divider.addEventListener("pointerdown", (e) => {
    dragging = true;
    els.divider.classList.add("dragging");
    document.body.style.cursor = "col-resize";
    e.preventDefault();
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
  });

  els.divider.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const current = parseFloat(getComputedStyle(els.split).getPropertyValue("--left")) || 52;
    const next = Math.min(80, Math.max(24, current + (e.key === "ArrowLeft" ? -4 : 4)));
    els.split.style.setProperty("--left", next + "%");
  });
})();

/* ---------------- 启动 ---------------- */

(async () => {
  try {
    await loadPosts();
    let last = null;
    try {
      last = localStorage.getItem("e616:editor:last");
    } catch {
      /* noop */
    }
    const target =
      (last && state.posts.some((p) => p.file === last) && last) ||
      state.posts[0]?.file;
    if (target) await loadPost(target);
    else setStatus("没有可编辑的文章", "dirty");
  } catch (err) {
    setStatus(`初始化失败：${err.message}`, "dirty");
  }
})();

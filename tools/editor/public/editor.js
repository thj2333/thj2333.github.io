/* Jarvis · 站点控制台 —— 前端逻辑 */

const $ = (sel) => document.querySelector(sel);

const els = {
  tree: $("#tree"),
  treePane: $("#tree-pane"),
  toggleTree: $("#toggle-tree"),
  path: $("#path"),
  meta: $("#meta"),
  code: $("#code"),
  gutter: $("#gutter"),
  preview: $("#preview"),
  previewTitle: $("#preview-title"),
  previewHint: $("#preview-hint"),
  status: $("#status"),
  save: $("#save"),
  fileLabel: $("#file-label"),
  count: $("#count"),
  split: $("#split"),
  divider: $("#divider"),
  openSite: $("#open-site"),
  palette: $("#palette"),
  paletteInput: $("#palette-input"),
  paletteList: $("#palette-list"),
};

const SITE_BASE = `http://${location.hostname}:4321`;
const LINE_HEIGHT = 21;

const CAT_LABEL = {
  cinema: "IP 电影",
  tools: "实用工具",
  research: "技术研究",
  music: "音乐鉴赏",
  travel: "旅游美食",
  whatif: "假如",
};

const state = {
  path: null,
  saved: "",
  dirty: false,
  ready: false,
  pending: null,
  mode: "other",
  files: [],
  lastLine: 1,
  renderSeq: 0,
  paletteIndex: 0,
  paletteItems: [],
};

/* ---------------- 通用 ---------------- */

function setStatus(text, kind = "") {
  els.status.textContent = text;
  els.status.className = "status" + (kind ? " " + kind : "");
}

function markDirty(dirty) {
  state.dirty = dirty;
  els.save.disabled = !dirty || !state.path;
  if (dirty) setStatus("未保存更改", "dirty");
}

function updateCounts() {
  const value = els.code.value;
  const lines = value.split("\n").length;
  els.count.textContent = `${lines} 行 · ${value.length.toLocaleString()} 字符`;
  els.gutter.textContent = Array.from({ length: lines }, (_, i) => i + 1).join("\n");
}

function syncGutter() {
  els.gutter.scrollTop = els.code.scrollTop;
}

const isMarkdown = (p) => /\.(md|mdx)$/i.test(p || "");

/* ---------------- 站点链接 ---------------- */

function siteUrl(p) {
  if (!p) return SITE_BASE + "/";
  if (p.startsWith("src/pages/")) {
    let rest = p.slice("src/pages/".length).replace(/\.(astro|md|mdx)$/i, "");
    if (rest.includes("[")) return SITE_BASE + "/";
    if (rest === "index") return SITE_BASE + "/";
    rest = rest.replace(/\/index$/, "");
    return SITE_BASE + "/" + rest + "/";
  }
  if (p.startsWith("src/content/blog/")) {
    const slug = p.split("/").pop().replace(/\.(md|mdx)$/i, "");
    return SITE_BASE + "/blog/" + slug + "/";
  }
  return SITE_BASE + "/";
}

function openSiteTab() {
  window.open(siteUrl(state.path), "_blank", "noopener");
}

/* ---------------- 文件树 ---------------- */

function buildTree(paths) {
  const root = { dirs: new Map(), files: [] };
  for (const p of paths) {
    const parts = p.split("/");
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const d = parts[i];
      if (!node.dirs.has(d)) node.dirs.set(d, { dirs: new Map(), files: [] });
      node = node.dirs.get(d);
    }
    node.files.push({ name: parts[parts.length - 1], path: p });
  }
  return root;
}

function renderTree(node, container, depth) {
  for (const [name, child] of [...node.dirs.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    const det = document.createElement("details");
    det.className = "tree-dir";
    if (depth === 0) det.open = true;
    const sum = document.createElement("summary");
    sum.textContent = name;
    det.appendChild(sum);
    const inner = document.createElement("div");
    inner.className = "tree-children";
    renderTree(child, inner, depth + 1);
    det.appendChild(inner);
    container.appendChild(det);
  }
  for (const f of node.files.sort((a, b) => a.name.localeCompare(b.name))) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tree-file";
    btn.dataset.path = f.path;
    btn.textContent = f.name;
    btn.title = f.path;
    btn.addEventListener("click", () => openFile(f.path));
    container.appendChild(btn);
  }
}

async function loadTree() {
  const res = await fetch("/api/tree");
  const data = await res.json();
  state.files = data.files || [];
  els.tree.innerHTML = "";
  renderTree(buildTree(state.files.map((f) => f.path)), els.tree, 0);
}

function markActiveFile(path) {
  els.tree
    .querySelectorAll(".tree-file")
    .forEach((el) => el.classList.toggle("active", el.dataset.path === path));
  const active = els.tree.querySelector(".tree-file.active");
  if (active) {
    let p = active.parentElement;
    while (p && p !== els.tree) {
      if (p.tagName === "DETAILS") p.open = true;
      p = p.parentElement;
    }
  }
}

/* ---------------- 预览 ---------------- */

const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

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

function sendHtml(html) {
  state.pending = html;
  if (!state.ready) return;
  els.preview.contentWindow.postMessage({ type: "html", html }, "*");
}

async function renderPreview() {
  if (!isMarkdown(state.path)) return;
  const seq = ++state.renderSeq;
  try {
    const res = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: els.code.value }),
    });
    if (!res.ok) throw new Error(`render ${res.status}`);
    const data = await res.json();
    if (seq !== state.renderSeq) return;
    sendHtml(previewHeader(data.meta) + data.html);
    paintMeta(data.meta);
  } catch (err) {
    setStatus(`预览失败：${err.message}`, "dirty");
  }
}

let renderTimer = null;
function scheduleRender() {
  if (!isMarkdown(state.path)) return;
  clearTimeout(renderTimer);
  renderTimer = setTimeout(renderPreview, 220);
}

function paintMeta(meta) {
  if (!meta) {
    els.meta.innerHTML = "";
    return;
  }
  const cat = CAT_LABEL[meta.cat] || meta.cat || "";
  const issue = meta.issue ? `#${String(meta.issue).padStart(3, "0")}` : "";
  els.meta.innerHTML = [issue, cat]
    .filter(Boolean)
    .map((t) => `<span>${escapeHtml(t)}</span>`)
    .join("");
}

function setMode(mode) {
  state.mode = mode;
  const md = mode === "md";
  // 非 Markdown 没有实时预览：收起预览栏，编辑器占满
  document.body.classList.toggle("hide-preview", !md);
  els.preview.hidden = !md;
  els.previewTitle.textContent = md ? "预览" : "无预览";
  els.previewHint.textContent = md
    ? "双击任意段落 → 跳到源码对应行"
    : "保存后到本地站点查看";
}

/* ---------------- 打开 / 保存 ---------------- */

async function openFile(path) {
  if (!path) return;
  if (state.dirty && !confirm("当前修改还没保存，确定切换文件？")) return;

  setStatus("读取中…");
  const res = await fetch("/api/file?path=" + encodeURIComponent(path));
  if (!res.ok) {
    setStatus("读取失败", "dirty");
    return;
  }
  const data = await res.json();

  state.path = data.path;
  state.saved = data.content;
  state.dirty = false;
  els.save.disabled = true;

  els.code.value = data.content;
  els.path.textContent = data.path;
  els.fileLabel.textContent = data.path.split("/").pop();
  els.meta.innerHTML = "";

  const md = isMarkdown(data.path);
  setMode(md ? "md" : "other");

  updateCounts();
  syncGutter();
  markActiveFile(data.path);

  if (md) await renderPreview();

  setStatus(md ? "已加载" : "已加载（无预览）", "saved");
  try {
    localStorage.setItem("jarvis:last", data.path);
  } catch {
    /* noop */
  }
}

async function save() {
  if (!state.path) return;
  els.save.disabled = true;
  setStatus("保存中…");
  try {
    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: state.path, content: els.code.value }),
    });
    if (!res.ok) throw new Error(`save ${res.status}`);
    const data = await res.json();
    state.saved = els.code.value;
    markDirty(false);
    const t = new Date(data.mtime || Date.now());
    const hh = String(t.getHours()).padStart(2, "0");
    const mm = String(t.getMinutes()).padStart(2, "0");
    const ss = String(t.getSeconds()).padStart(2, "0");
    setStatus(`已保存 ${hh}:${mm}:${ss}`, "saved");
    if (isMarkdown(state.path)) renderPreview();
  } catch (err) {
    markDirty(true);
    setStatus(`保存失败：${err.message}`, "dirty");
  }
}

/* ---------------- 定位与高亮 ---------------- */

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
  els.code.scrollTop = Math.max(0, (startLine - 1) * LINE_HEIGHT - LINE_HEIGHT * 3);
  syncGutter();
  setStatus(`已定位到第 ${startLine} 行`, "saved");
  setTimeout(() => {
    if (state.dirty) setStatus("未保存更改", "dirty");
  }, 1600);
}

function lineAtCaret() {
  return els.code.value.slice(0, els.code.selectionStart).split("\n").length;
}

function highlightInPreview() {
  if (state.mode !== "md" || !state.ready) return;
  els.preview.contentWindow.postMessage(
    { type: "highlight", line: lineAtCaret() },
    "*",
  );
}

/* ---------------- 快速打开 ---------------- */

function filteredFiles(query) {
  const q = query.trim().toLowerCase();
  if (!q) return state.files;
  return state.files.filter((f) => f.path.toLowerCase().includes(q));
}

function paintPalette() {
  const q = els.paletteInput.value;
  state.paletteItems = filteredFiles(q).slice(0, 40);
  state.paletteIndex = 0;
  els.paletteList.innerHTML = state.paletteItems
    .map((f, i) => {
      const parts = f.path.split("/");
      const file = parts.pop();
      const dir = parts.join("/");
      return `<li data-i="${i}" class="${i === 0 ? "active" : ""}">
        <span>${escapeHtml(file)}</span><span class="dir">${escapeHtml(dir)}</span>
      </li>`;
    })
    .join("");
}

function movePalette(delta) {
  if (!state.paletteItems.length) return;
  state.paletteIndex =
    (state.paletteIndex + delta + state.paletteItems.length) %
    state.paletteItems.length;
  els.paletteList
    .querySelectorAll("li")
    .forEach((li, i) => li.classList.toggle("active", i === state.paletteIndex));
}

function openPalette() {
  els.palette.hidden = false;
  els.paletteInput.value = "";
  paintPalette();
  els.paletteInput.focus();
}

function closePalette() {
  els.palette.hidden = true;
}

function choosePalette(i) {
  const item = state.paletteItems[i];
  if (!item) return;
  closePalette();
  openFile(item.path);
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
els.openSite.addEventListener("click", openSiteTab);

els.toggleTree.addEventListener("click", () => {
  document.body.classList.toggle("hide-tree");
});

els.paletteInput.addEventListener("input", paintPalette);
els.paletteInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    movePalette(1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    movePalette(-1);
  } else if (e.key === "Enter") {
    e.preventDefault();
    choosePalette(state.paletteIndex);
  } else if (e.key === "Escape") {
    closePalette();
  }
});
els.paletteList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (li) choosePalette(Number(li.dataset.i));
});
els.palette.addEventListener("click", (e) => {
  if (e.target === els.palette) closePalette();
});

window.addEventListener("keydown", (e) => {
  const mod = e.metaKey || e.ctrlKey;
  if (mod && e.key.toLowerCase() === "s") {
    e.preventDefault();
    if (state.dirty) save();
  } else if (mod && e.key.toLowerCase() === "p") {
    e.preventDefault();
    openPalette();
  } else if (e.key === "Escape" && !els.palette.hidden) {
    closePalette();
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
      els.preview.contentWindow.postMessage(
        { type: "html", html: state.pending },
        "*",
      );
    }
    return;
  }
  if (d.type === "locate") jumpToLine(d.line, d.endline);
});

/* ---------------- 分栏拖拽 ---------------- */

(() => {
  let dragging = false;
  const onMove = (e) => {
    if (!dragging) return;
    const rect = els.split.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    els.split.style.setProperty("--left", Math.min(78, Math.max(18, pct)) + "%");
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
})();

/* ---------------- 启动 ---------------- */

(async () => {
  try {
    await loadTree();
    let last = null;
    try {
      last = localStorage.getItem("jarvis:last");
    } catch {
      /* noop */
    }
    const target =
      (last && state.files.some((f) => f.path === last) && last) ||
      state.files.find((f) => f.path === "src/pages/index.astro")?.path ||
      state.files[0]?.path;
    if (target) await openFile(target);
    else setStatus("没有可编辑的文件", "dirty");
  } catch (err) {
    setStatus(`初始化失败：${err.message}`, "dirty");
  }
})();

/* ---------------- 发布（Jarvis 功能 02） ---------------- */

(() => {
  const id = (x) => document.getElementById(x);
  const U = {
    publish: id("publish"),
    modeEdit: id("mode-edit"),
    modePublish: id("mode-publish"),
    repoLine: id("repo-line"),
    remoteEdit: id("remote-edit"),
    remoteUrl: id("remote-url"),
    remoteSave: id("remote-save"),
    remoteMsg: id("remote-msg"),
    refresh: id("git-refresh"),
    setRemote: id("git-set-remote"),
    build: id("git-build"),
    commit: id("git-commit"),
    push: id("git-push"),
    pushHint: id("push-hint"),
    changeCount: id("change-count"),
    changeList: id("change-list"),
    commitMsg: id("commit-msg"),
    commitLog: id("commit-log"),
    buildCard: id("build-card"),
    buildOut: id("build-out"),
    split: document.getElementById("split"),
  };

  let git = null;

  function remoteMsg(text, kind = "") {
    U.remoteMsg.hidden = !text;
    U.remoteMsg.textContent = text;
    U.remoteMsg.style.color =
      kind === "error" ? "#f87171" : kind === "ok" ? "#4ade80" : "";
  }

  function setPublishMode(on) {
    document.body.classList.toggle("mode-publish", on);
    U.split.hidden = on;
    U.publish.hidden = !on;
    U.modeEdit.classList.toggle("active", !on);
    U.modePublish.classList.toggle("active", on);
    U.modeEdit.setAttribute("aria-selected", String(!on));
    U.modePublish.setAttribute("aria-selected", String(on));
    if (on) refreshGit();
  }

  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );

  function actionsUrl(g) {
    return g.remoteOwner && g.remoteRepo
      ? `https://github.com/${g.remoteOwner}/${g.remoteRepo}/actions`
      : null;
  }

  function renderRepo(g) {
    const remote = g.remote
      ? `<b>${esc(g.remote.replace("https://github.com/", "gh:"))}</b>`
      : `<span class="warn">未设置</span>`;
    const link = actionsUrl(g)
      ? ` · <a href="${actionsUrl(g)}" target="_blank" rel="noopener" style="color:var(--gold)">Actions ↗</a>`
      : "";
    U.repoLine.innerHTML = `
      <span>分支 <b>${esc(g.branch)}</b></span>
      <span>远端 ${remote}${link}</span>
      <span>领先 <b>${g.ahead}</b> · 落后 <b>${g.behind}</b>${g.remoteDefault && g.remoteDefault !== g.branch ? `（对比 origin/${esc(g.remoteDefault)}）` : ""}</span>
      <span>提交身份 <b>${esc(g.identity.name)}</b>${g.identity.fromRepo ? "" : "（默认）"}</span>
    `;
  }

  function renderChanges(g) {
    U.changeCount.textContent = String(g.files.length);
    if (!g.files.length) {
      U.changeList.innerHTML = `<li class="empty">工作区干净，没有待提交的改动。</li>`;
      return;
    }
    U.changeList.innerHTML = g.files
      .map((f) => {
        const code = f.code === "??" ? "A" : f.code.replace(/[^MADRC]/g, "") || "M";
        const stat = f.stat
          ? `<span class="stat"><b class="add">+${f.stat.add}</b> <b class="del">-${f.stat.del}</b></span>`
          : "";
        return `<li>
          <span class="code ${code}">${code}</span>
          <span class="path" title="${esc(f.path)}">${esc(f.path)}</span>
          ${stat}
        </li>`;
      })
      .join("");
  }

  function renderLog(g) {
    U.commitLog.innerHTML = g.log.length
      ? g.log
          .map(
            (c) =>
              `<li><span class="hash">${esc(c.hash)}</span><span class="sub" title="${esc(c.subject)}">${esc(c.subject)}</span><span class="date">${esc(c.date)}</span></li>`,
          )
          .join("")
      : `<li class="empty">还没有提交。</li>`;
  }

  function renderHint(g) {
    if (!g.initialized) {
      U.pushHint.textContent = "当前目录不是 git 仓库。";
      return;
    }
    if (!g.remote) {
      U.pushHint.innerHTML = "还没有远端仓库：先点「设置远端」填一个 GitHub 仓库地址。";
      return;
    }
    if (g.ahead > 0) {
      const url = actionsUrl(g);
      U.pushHint.innerHTML = `有 ${g.ahead} 个提交待推送。推送后 GitHub Actions 会自动构建并部署${
        url ? `（<a href="${url}" target="_blank" rel="noopener">查看 Actions ↗</a>）` : ""
      }。`;
      return;
    }
    if (g.remoteDefault && g.remoteDefault !== g.branch) {
      U.pushHint.innerHTML = `远端默认分支是 <b>${esc(g.remoteDefault)}</b>，推送会新建 <b>${esc(g.branch)}</b> 分支，不会覆盖旧站。切默认分支和 Pages 源到新分支后才会生效。`;
      return;
    }
    U.pushHint.innerHTML = "本地与远端一致。改完东西记得先「构建校验」，再提交、推送。";
  }

  async function refreshGit() {
    try {
      const res = await fetch("/api/git/status");
      git = await res.json();
      renderRepo(git);
      renderChanges(git);
      renderLog(git);
      renderHint(git);
      U.push.disabled = !git.remote || git.ahead === 0;
      // 没有远端时直接把输入框展开，省得用户找不到
      if (!git.remote) U.remoteEdit.hidden = false;
    } catch (err) {
      U.repoLine.innerHTML = `<span class="warn">读取失败：${esc(err.message)}</span>`;
    }
  }

  async function post(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  U.modeEdit.addEventListener("click", () => setPublishMode(false));
  U.modePublish.addEventListener("click", () => setPublishMode(true));
  U.refresh.addEventListener("click", refreshGit);

  U.setRemote.addEventListener("click", () => {
    U.remoteEdit.hidden = !U.remoteEdit.hidden;
    if (!U.remoteEdit.hidden) {
      U.remoteUrl.value = git?.remote || "";
      U.remoteUrl.focus();
    }
  });

  U.remoteSave.addEventListener("click", async () => {
    const url = U.remoteUrl.value.trim();
    if (!url) {
      remoteMsg("请填写仓库地址", "error");
      return;
    }
    remoteMsg("保存中…");
    try {
      const data = await post("/api/git/remote", { url });
      U.remoteEdit.hidden = true;
      remoteMsg(`已保存远端：${data.status.remote}`, "ok");
      await refreshGit();
    } catch (err) {
      remoteMsg(err.message, "error");
    }
  });

  U.commit.addEventListener("click", async () => {
    const message = U.commitMsg.value.trim();
    if (!message) {
      U.commitMsg.focus();
      return;
    }
    U.commit.disabled = true;
    try {
      await post("/api/git/commit", { message });
      U.commitMsg.value = "";
      await refreshGit();
    } catch (err) {
      remoteMsg(`提交失败：${err.message}`, "error");
    } finally {
      U.commit.disabled = false;
    }
  });

  U.push.addEventListener("click", async () => {
    U.push.disabled = true;
    try {
      const data = await post("/api/git/push");
      U.buildCard.hidden = false;
      U.buildOut.textContent = data.output || "已推送。";
      await refreshGit();
    } catch (err) {
      U.buildCard.hidden = false;
      U.buildOut.textContent = "推送失败：\n" + err.message;
    } finally {
      U.push.disabled = false;
    }
  });

  U.build.addEventListener("click", async () => {
    U.build.disabled = true;
    U.buildCard.hidden = false;
    U.buildOut.textContent = "构建中…（首次可能要十几秒）";
    try {
      const data = await post("/api/git/build");
      U.buildOut.textContent =
        (data.ok ? "✓ 构建通过\n\n" : "✗ 构建失败\n\n") + (data.output || "");
      U.buildOut.style.color = data.ok ? "#a9b6c8" : "#f87171";
    } catch (err) {
      U.buildOut.textContent = "构建失败：" + err.message;
      U.buildOut.style.color = "#f87171";
    } finally {
      U.build.disabled = false;
    }
  });

  // ⌘⇧E / ⌘⇧P 切换模式
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "e") {
      e.preventDefault();
      setPublishMode(!document.body.classList.contains("mode-publish"));
    }
  });
})();

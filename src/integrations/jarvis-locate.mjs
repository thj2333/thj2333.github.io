/**
 * Jarvis 定位（可选：带编辑/浏览模式）
 *
 * dev 模式下给每个页面注入一段脚本：
 *   - 编辑模式（默认）：点击/双击只把元素位置发给 Jarvis，不触发任何跳转
 *   - 浏览模式：放行所有交互，正常点链接、按按钮
 *
 * 模式由外层通过 postMessage({type:'jarvis-mode', edit:boolean}) 切换。
 */
export default function jarvisLocate() {
  return {
    name: "jarvis-locate",
    hooks: {
      "astro:config:setup": ({ command, injectScript }) => {
        if (command !== "dev") return;
        injectScript(
          "page",
          `(() => {
  if (window.__jarvisLocate) return;
  window.__jarvisLocate = true;
  if (window.parent === window) return;

  // 默认编辑模式：先拦住，等外层确认再放开
  let edit = true;
  let last = 0;

  function pickText(el) {
    let node = el;
    for (let i = 0; i < 4 && node; i++) {
      const t = (node.textContent || "").replace(/\\s+/g, " ").trim();
      if (t && t.length <= 200) return { text: t, tag: node.tagName.toLowerCase() };
      node = node.parentElement;
    }
    return { text: "", tag: el.tagName.toLowerCase() };
  }

  function report(el) {
    if (!el || el.nodeType !== 1) return;
    const now = Date.now();
    if (now - last < 180) return; // click / dblclick 会连着来，去重
    last = now;
    const { text, tag } = pickText(el);
    window.parent.postMessage(
      { type: "jarvis-locate", text, tag, route: location.pathname + location.search },
      "*",
    );
  }

  function block(e) {
    if (!edit) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  // 捕获阶段拦截：链接、按钮、表单都不会生效
  document.addEventListener(
    "click",
    (e) => {
      if (!edit) return;
      block(e);
      report(e.target);
    },
    true,
  );

  document.addEventListener(
    "dblclick",
    (e) => {
      if (!edit) return;
      block(e);
      report(e.target);
    },
    true,
  );

  // 键盘触发的提交/激活也拦掉（Tab 到按钮按回车）
  document.addEventListener(
    "keydown",
    (e) => {
      if (!edit) return;
      if (e.key === "Enter" || e.key === " ") {
        const el = e.target;
        if (el && (el.tagName === "A" || el.tagName === "BUTTON" || el.closest("a"))) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    },
    true,
  );

  window.addEventListener("message", (e) => {
    if (e.source !== window.parent) return;
    const d = e.data || {};
    if (d.type === "jarvis-mode") {
      edit = !!d.edit;
      document.documentElement.setAttribute(
        "data-jarvis-mode",
        edit ? "edit" : "browse",
      );
    }
  });

  document.documentElement.setAttribute("data-jarvis-mode", "edit");
  window.parent.postMessage({ type: "jarvis-locate-ready" }, "*");
})();
`,
        );
      },
    },
  };
}

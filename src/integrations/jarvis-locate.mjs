/**
 * Jarvis 定位：dev 模式下给每个页面注入一段脚本，
 * 双击元素时把元素文字/位置发给外层（Jarvis 站点预览），由它反查源码行。
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

  function pickText(el) {
    let node = el;
    for (let i = 0; i < 4 && node; i++) {
      const t = (node.textContent || "").replace(/\\s+/g, " ").trim();
      if (t && t.length <= 200) return { text: t, tag: node.tagName.toLowerCase() };
      node = node.parentElement;
    }
    return { text: "", tag: el.tagName.toLowerCase() };
  }

  document.addEventListener(
    "dblclick",
    (e) => {
      const el = e.target;
      if (!el || el.nodeType !== 1) return;
      const { text, tag } = pickText(el);
      window.parent.postMessage(
        {
          type: "jarvis-locate",
          text,
          tag,
          route: location.pathname + location.search,
        },
        "*",
      );
      e.preventDefault();
    },
    true,
  );
})();
`,
        );
      },
    },
  };
}

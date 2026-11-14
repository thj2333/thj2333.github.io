import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://thj2333.github.io",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});

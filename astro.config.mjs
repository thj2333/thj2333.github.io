import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import jarvisLocate from "./src/integrations/jarvis-locate.mjs";

export default defineConfig({
  site: "https://thj2333.github.io",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  integrations: [mdx(), jarvisLocate()],
  vite: {
    plugins: [tailwindcss()],
  },
});

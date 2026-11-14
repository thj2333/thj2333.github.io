import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://thj2333.github.io",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});

// vitest.config.ts (o vite.config.ts si usas ese)
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "src/App.vue",
        "**/index.ts",
        "src/main.ts",
        "src/types/**",
        "src/copy/**",
        "**/*.d.ts",
        "**/*.config.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

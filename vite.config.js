import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  resolve: {
    // Element UI 的 CommonJS 入口和应用必须使用同一个 Vue 实例。
    // Vitest 的 Vue Test Utils 使用 Node 的 CommonJS 入口。
    alias: mode === "test" ? [] : [
      { find: /^vue$/, replacement: "vue/dist/vue.runtime.esm.js" },
    ],
  },
  test: { environment: "jsdom", setupFiles: ["./tests/setup.js"] },
}));

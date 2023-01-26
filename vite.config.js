import { defineConfig } from "vite";
import path from "path";

console.log("Path: ", __dirname, path.resolve(__dirname, "src"));

export default defineConfig({
  root: "src",

  build: {
    // Relative to the root
    outDir: "./build",
  },
  resolve: {
    alias: {
      //   find: "@",
      //   replacement: path.resolve(__dirname, "/src"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api/": {
        target: "http://localhost:3001",
      },
    },
    port: 3000,
    strictPort: true,
    open: true,
  },
});

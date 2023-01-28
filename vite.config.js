import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import path from "path";

const config = (() => {
  const configs = {
    root: "src",

    build: {
      // Relative to the root
      outDir: "../build",
    },
    resolve: {
      alias: {
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
    plugins: [viteCompression()],
  };

  if (process.env.NODE_ENV === "production") {
    configs.plugins;
  }
  return defineConfig(configs);
})();

export default config;

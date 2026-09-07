import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // Preserve the browser targets used by the original Vite 5 build.
    target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
});

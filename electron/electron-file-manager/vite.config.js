import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // ✅ Change this to 5174 (or any other available port)
  },
  build: {
    outDir: "dist", // Ensure Electron can find the build
  },
});

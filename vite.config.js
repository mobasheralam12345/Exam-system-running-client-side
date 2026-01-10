import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Force all imports of "html2canvas" to use html2canvas-pro
      html2canvas: "html2canvas-pro",
    },
  },
});

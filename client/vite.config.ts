import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { theme } from "antd";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  css: {
    preprocessorOptions: {
      less: {
        modifyVar: {
          "primary-color": "#4b0082", // Changing the primary color globally
          "link-color": "#4b0082", // Changing link colors (optional)
          // "border-radius-base": "6px", // Changing border radius globally (optional)
        },
        javascriptEnabled: true,
      },
    },
  },

  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
});

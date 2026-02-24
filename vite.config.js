import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Use a relative base so the built site works on GitHub Pages and other hosts
  // regardless of the repository name / subpath.
  base: "./",
});

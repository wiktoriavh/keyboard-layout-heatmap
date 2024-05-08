import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  if (command === "build") {
    return {
      base: "/keyboard-layout-heatmap/",
      plugins: [tailwindcss()],
    };
  }

  return {
    base: "/",
    plugins: [tailwindcss()],
  };
});

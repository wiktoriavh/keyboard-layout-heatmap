import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  if (command === "build") {
    return {
      base: "/keyboard-heatmap/",
    };
  }

  return {
    base: "/",
  };
});

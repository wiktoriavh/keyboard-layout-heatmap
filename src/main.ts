import { Heatmap, defaultHeatmap } from "./defaulHeatmap";
import { colemak } from "./lib/colemak";
import { qwerty } from "./lib/qwerty";
import "./style.css";

import Alpine from "alpinejs";

window.Alpine ??= Alpine;

function readTextFile(file: string): Promise<string> {
  return fetch(file)
    .then((response) => response.text())
    .catch((error) => {
      console.error("Error reading file:", error);
      throw error;
    });
}

Alpine.data("keyboard", () => ({
  layout: "qwerty",
  sample: "qwerty",
  heatmap: defaultHeatmap,
  samples: {} as Record<string, string>,
  layouts: { qwerty, colemak },
  staggered: false,

  init() {
    this.$watch("sample", (input) => {
      this.heatmap = input
        .replace(/\s/gm, "")
        .split("")
        .reduce((acc, char) => {
          if (char === "\n") return acc;
          if (acc.hasOwnProperty(char)) {
            acc[char].number++;
          } else {
            acc[char] = { number: 1, heat: 0, color: "" };
          }
          return acc;
        }, {} as Heatmap);

      const max = Math.max(...Object.values(this.heatmap).map((v) => v.number));

      Object.keys(this.heatmap).forEach((k) => {
        this.heatmap[k].heat = this.heatmap[k].number / max;
        this.heatmap[k].color = this.getColor(this.heatmap[k].heat);
      });
    });
  },

  setSample(sampleType: string) {
    if (this.samples.hasOwnProperty(sampleType)) {
      this.sample = this.samples[sampleType];
    } else {
      readTextFile(`${sampleType}.txt`).then((text) => {
        this.samples[sampleType] = text;
        this.sample = text;
      });
    }
  },

  getLayout(layout: string) {
    this.layout = layout;
  },

  getColor(value: number) {
    const h = 350;
    const s = 60;
    const l = -(value * 70) + 100;
    return `hsl(${h}, ${s}%, ${l}%)`;
  },

  toggleStaggered() {
    this.staggered = !this.staggered;
  },
}));

Alpine.start();

import { Heatmap, defaultHeatmap } from "./defaulHeatmap";
import { ansi } from "./lib/boards";
import { colemak, colemakDH, dvorak, qwerty } from "./lib/layouts";

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

type Keyboard = {
  value: string;
  size: number;
};

Alpine.data("keyboard", () => ({
  layout: "qwerty",
  sample: "",
  heatmap: defaultHeatmap,
  samples: {} as Record<string, string>,
  layouts: { qwerty, colemak, colemakDH, dvorak } as Record<string, string[][]>,
  staggered: false,

  board: "ansi",
  boards: { ansi } as Record<string, { size: number }[][]>,

  keyboard: [] as Keyboard[][],

  init() {
    this.keyboard = this.boards[this.board].map((row, rowIndex) => {
      return row.map((key, keyIndex) => {
        return {
          value: this.layouts[this.layout][rowIndex][keyIndex],
          ...key,
        };
      });
    });

    this.$watch("layout", (layout) => {
      this.keyboard = this.boards[this.board].map((row, rowIndex) => {
        return row.map((key, keyIndex) => {
          return {
            value: this.layouts[layout][rowIndex][keyIndex],
            ...key,
          };
        });
      });
    });

    this.$watch("board", (layout) => {
      //
    });

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

import { Heatmap, defaultHeatmap } from "./defaulHeatmap";
import { ansi } from "./lib/boards";
import {
  ansiColemak,
  ansiColemakDH,
  ansiDvorak,
  ansiQwerty,
} from "./lib/ansiLayouts";

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

type Layouts = {
  [keyB: string]: {
    name: string;
    value: { [keyL: string]: { value: string[][]; name: string } };
  };
};

Alpine.data("keyboard", () => ({
  layout: "qwerty",
  sample: "",
  heatmap: defaultHeatmap,
  samples: {} as Record<string, string>,
  layouts: {
    ansi: {
      name: "ANSI Standard",
      value: {
        qwerty: { value: ansiQwerty, name: "QWERTY" },
        colemak: { value: ansiColemak, name: "Colemak" },
        colemakDH: { value: ansiColemakDH, name: "Colemak DH" },
        dvorak: { value: ansiDvorak, name: "Dvorak" },
      },
    },
    // planck: {
    //   name: "Planck",
    //   value: {
    //     nope: {
    //       value: [[]],
    //       name: "Nope",
    //     },
    //   },
    // },
  } as Layouts,
  staggered: false,

  board: "ansi",
  boards: { ansi } as Record<string, { size: number }[][]>,

  keyboard: [] as Keyboard[][],

  init() {
    this.updateKeyboard();

    this.$watch("layout", () => {
      this.updateKeyboard();
    });

    this.$watch("board", () => {
      this.updateKeyboard();
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

  updateKeyboard() {
    this.keyboard = this.boards[this.board].map((row, rowIndex) => {
      return row.map((key, keyIndex) => {
        return {
          value:
            this.layouts[this.board].value[this.layout].value[rowIndex][
              keyIndex
            ],
          ...key,
        };
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

  getBoard(board: string) {
    this.board = board;
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

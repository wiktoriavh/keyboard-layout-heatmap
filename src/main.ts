import "./style.css";

import Alpine from "alpinejs";

window.Alpine ??= Alpine;

type Heatmap = {
  [x: string]: {
    heat: number;
    number: number;
    color: string;
  };
};

const defaultHeatmap: Heatmap = {
  a: { heat: 0, number: 0 },
  b: { heat: 0, number: 0 },
  c: { heat: 0, number: 0 },
  d: { heat: 0, number: 0 },
  e: { heat: 0, number: 0 },
  f: { heat: 0, number: 0 },
  g: { heat: 0, number: 0 },
  h: { heat: 0, number: 0 },
  i: { heat: 0, number: 0 },
  j: { heat: 0, number: 0 },
  k: { heat: 0, number: 0 },
  l: { heat: 0, number: 0 },
  m: { heat: 0, number: 0 },
  n: { heat: 0, number: 0 },
  o: { heat: 0, number: 0 },
  p: { heat: 0, number: 0 },
  q: { heat: 0, number: 0 },
  r: { heat: 0, number: 0 },
  s: { heat: 0, number: 0 },
  t: { heat: 0, number: 0 },
  u: { heat: 0, number: 0 },
  v: { heat: 0, number: 0 },
  w: { heat: 0, number: 0 },
  x: { heat: 0, number: 0 },
  y: { heat: 0, number: 0 },
  z: { heat: 0, number: 0 },
};

function readTextFile(file: string): Promise<string> {
  return fetch(file)
    .then((response) => response.text())
    .catch((error) => {
      console.error("Error reading file:", error);
      throw error;
    });
}

Alpine.data("keyboard", () => ({
  layout: "",
  sample: "uiaeosnrtdyuaonty",
  heatmap: defaultHeatmap,
  samples: {} as Record<string, string>,
  layouts: {} as Record<string, string>,

  init() {
    this.getLayout("neo-german");

    this.$watch("sample", (input) => {
      this.heatmap = input
        .replace(/\s/gm, "")
        .split("")
        .reduce((acc, char) => {
          if (char === "\n") return acc;
          if (acc.hasOwnProperty(char)) {
            acc[char].number++;
          } else {
            acc[char] = { number: 1, heat: 0 };
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
    if (this.layouts.hasOwnProperty(layout)) {
      this.layout = this.layouts[layout];
    } else {
      readTextFile(`${layout}.txt`).then((text) => {
        this.layouts[layout] = text;
        this.layout = text;
      });
    }
  },

  getColor(value: number) {
    const h = 350;
    const s = 60;
    const l = -(value * 70) + 100;
    return `hsl(${h}, ${s}%, ${l}%)`;
  },
}));

Alpine.start();

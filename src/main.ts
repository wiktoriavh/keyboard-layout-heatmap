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
  a: {
    heat: 0,
    number: 0,
    color: "",
  },
  b: {
    heat: 0,
    number: 0,
    color: "",
  },
  c: {
    heat: 0,
    number: 0,
    color: "",
  },
  d: {
    heat: 0,
    number: 0,
    color: "",
  },
  e: {
    heat: 0,
    number: 0,
    color: "",
  },
  f: {
    heat: 0,
    number: 0,
    color: "",
  },
  g: {
    heat: 0,
    number: 0,
    color: "",
  },
  h: {
    heat: 0,
    number: 0,
    color: "",
  },
  i: {
    heat: 0,
    number: 0,
    color: "",
  },
  j: {
    heat: 0,
    number: 0,
    color: "",
  },
  k: {
    heat: 0,
    number: 0,
    color: "",
  },
  l: {
    heat: 0,
    number: 0,
    color: "",
  },
  m: {
    heat: 0,
    number: 0,
    color: "",
  },
  n: {
    heat: 0,
    number: 0,
    color: "",
  },
  o: {
    heat: 0,
    number: 0,
    color: "",
  },
  p: {
    heat: 0,
    number: 0,
    color: "",
  },
  q: {
    heat: 0,
    number: 0,
    color: "",
  },
  r: {
    heat: 0,
    number: 0,
    color: "",
  },
  s: {
    heat: 0,
    number: 0,
    color: "",
  },
  t: {
    heat: 0,
    number: 0,
    color: "",
  },
  u: {
    heat: 0,
    number: 0,
    color: "",
  },
  v: {
    heat: 0,
    number: 0,
    color: "",
  },
  w: {
    heat: 0,
    number: 0,
    color: "",
  },
  x: {
    heat: 0,
    number: 0,
    color: "",
  },
  y: {
    heat: 0,
    number: 0,
    color: "",
  },
  z: {
    heat: 0,
    number: 0,
    color: "",
  },
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

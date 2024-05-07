import "./style.css";

import Alpine from "alpinejs";

type Heatmap = {
  [x: string]: {
    heat: number;
    number: number;
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

Alpine.data("keyboard", () => ({
  layout: "xvlcwkhgfq\nuiaeosnrtdy\nüöäpzbm,.j",
  sample: "uiaeosnrtdyuaonty",
  heatmap: defaultHeatmap,

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
            acc[char] = { number: 1, heat: 0 };
          }
          return acc;
        }, {} as Heatmap);

      const max = Math.max(...Object.values(this.heatmap).map((v) => v.number));

      Object.keys(this.heatmap).forEach((k) => {
        this.heatmap[k].heat = (this.heatmap[k].number / max) * 100;
      });
    });
  },
}));

Alpine.start();

import banner from "./banner.js";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

let format, file;

if (process.env?.ES === "true") {
  format = "es";
  file = "dist/es/easyDrag.js";
} else {
  format = "umd";
  if (process.env?.MIN === "true") {
    file = "dist/umd/easyDrag.min.js";
  } else {
    file = "dist/umd/easyDrag.js";
  }
}

const plugins =
  process.env.MIN === "true"
    ? [typescript(), json(), terser()]
    : [typescript(), json()];

export default {
  input: "src/easyDrag.ts",
  output: {
    banner,
    file,
    format,
    name: "easyDrag",
  },
  plugins: plugins,
};

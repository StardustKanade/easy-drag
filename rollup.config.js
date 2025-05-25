import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));
const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * Author: ${pkg.author}
 * License: ${pkg.license}
 * Website: ${pkg.homepage}
 */`;

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/easy-drag.es.js",
      format: "es",
      name: "EasyDrag",
      banner,
    },
    {
      file: "dist/easy-drag.es.min.js",
      format: "es",
      name: "EasyDrag",
      plugins: [terser()],
      banner,
    },
    {
      file: "dist/easy-drag.js",
      format: "umd",
      name: "EasyDrag",
      banner,
    },
    {
      file: "dist/easy-drag.min.js",
      format: "umd",
      name: "EasyDrag",
      plugins: [terser()],
      banner,
    },
  ],
  plugins: [typescript()],
  external: [],
};

import { terser } from "rollup-plugin-terser";

const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV : "production";
const isProduction = nodeEnv === "production";

export default [
  {
    input: "src/main.js",
    output: {
      file: "public/dist/bundle.js",
      format: "iife",
      sourcemap: true,
      globals: {
        mousetrap: "Mousetrap",
        react: "React",
        "react-dom": "ReactDOM",
      },
    },
    plugins: [isProduction && terser()],
    external: ["mousetrap", "react", "react-dom"],
  },
];

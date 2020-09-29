import pluginBabel from "@rollup/plugin-babel";

const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV : "production";
const isProduction = nodeEnv === "production";

const babel = () => {
  return pluginBabel({ babelHelpers: "bundled" });
};

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
    plugins: [babel()],
    external: ["mousetrap", "react", "react-dom"],
  },
];

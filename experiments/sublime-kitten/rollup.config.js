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
        react: "React",
        "react-dom": "ReactDOM",
        "react-transition-group": "ReactTransitionGroup",
        "prop-types": "PropTypes",
      },
    },
    plugins: [babel()],
    external: ["react", "react-dom", "react-transition-group", "prop-types"],
  },
];

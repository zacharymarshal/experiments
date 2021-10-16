const arg = require("arg");
const express = require("express");
const routes = require("./routes");

async function newServer() {
  const server = {
    router: express(),
  };
  await routes(server);

  return server;
}

async function run(args) {
  if (!args["--port"]) {
    throw new Error("missing required argument: --port");
  }
  const port = args["--port"];
  const s = await newServer();
  s.router.listen(port, () => {
    console.log(`warmup-api listening on ::${port}`);
  });
}

const args = arg({
  "--port": Number,
});

run(args).catch((err) => {
  console.error(err);
  process.exit(1);
});

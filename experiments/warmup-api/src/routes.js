const handleErrors = require("./handleErrors");
const handleIndex = require("./handleIndex");
const handleFail = require("./handleFail");

async function routes(s) {
  s.router.get("/", await handleIndex(s));
  s.router.get("/fail", await handleFail(s));
  s.router.use(handleErrors);
}

module.exports = routes;

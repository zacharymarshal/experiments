const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const url = require("url");

const { createSigningUrl } = require("./docusign");

const handleNotFound = async (req, res) => {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain");
  res.end("Not found");
};

const handleHome = (indexHtml) => async (req, res) => {
  const signingUrl = await createSigningUrl({
    signerEmail: "rankin.zachary@gmail.com",
    signerName: "Zach Rankin",
    signerClientId: "1111",
    docFile: path.join(__dirname, "zachs-agreement.pdf"),
    docName: "Zach's Agreement",
    returnUrl: new URL("https://playground-1.zuuu.dev/docusign-return"),
    pingUrl: new URL("https://playground-1.zuuu.dev/docusign-ping"),
  });
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(indexHtml.replace("{{docuSignUrl}}", signingUrl));
};

const handleDocusignPing = async (req, res) => {
  console.log("docusign - ping");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("OK");
};

const handleDocusignReturn = async (req, res) => {
  const reqUrl = url.parse(req.url);
  console.log("docusign - return");
  console.log(reqUrl.query);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("OK");
};

(async () => {
  const indexHtml = await fs.readFile(
    path.join(__dirname, "index.html"),
    "utf-8"
  );

  const server = http.createServer(async (req, res) => {
    const reqUrl = url.parse(req.url);
    try {
      if (reqUrl.pathname === "/") {
        await handleHome(indexHtml)(req, res);
      } else if (reqUrl.pathname === "/docusign-ping") {
        await handleDocusignPing(req, res);
      } else if (reqUrl.pathname === "/docusign-return") {
        await handleDocusignReturn(req, res);
      } else {
        await handleNotFound(req, res);
      }
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      res.end("Error loading the page");
    }
  });

  const port = 7229;
  server.listen(port, "", () => {
    console.log("Started server...");
  });
})();

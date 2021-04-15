import path from "path";
import express from "express";

const app = express();
const port = process.env.PORT || 80;

app.disable("x-powered-by");
app.disable("etag");

app.set("views", path.join(path.resolve(), "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(path.resolve(), "public")));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/api", async (req, res) => {
  await sleep(2000);
  const name = req.query.name;
  if (name === "error") {
    res.status(500);
    res.json({});
    return;
  } else if (name === "no_data") {
    res.json([]);
    return;
  }

  res.json([...new Array(20)].map(() => ({
    name,
  })));
});
app.get("*", (req, res) => {
  res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Listening on :${port}`);
});

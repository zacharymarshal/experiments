function handleErrors(err, req, res, next) {
  console.error(JSON.stringify({ error: err.stack }));
  res.status(500).send({ error: "Ruh roh! Something bad happened." });
}

module.exports = handleErrors;

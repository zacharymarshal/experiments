async function handleIndex(s) {
  return (req, res) => {
    res.send({ message: "its alive!" });
  };
}

module.exports = handleIndex;

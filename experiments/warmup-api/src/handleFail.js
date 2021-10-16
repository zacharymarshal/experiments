async function handleFail(s) {
  return (req, res) => {
    throw new Error("this gonna fail");
  };
}

module.exports = handleFail;

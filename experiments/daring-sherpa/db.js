const db = {
  secretKey: process.env.KEY,
  go() {
    console.log('your secret key is:', this.secretKey);
  }
};

module.exports = db;

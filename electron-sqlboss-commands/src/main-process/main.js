const { app } = require('electron');

process.on('uncaughtException', function(error = {}) {
  if (error.message !== null) {
    console.log(error.message);
  }

  if (error.stack !== null) {
    console.log(error.stack);
  }
});

process.on('unhandledRejection', function(error = {}) {
  if (error.message !== null) {
    console.log(error.message);
  }

  if (error.stack !== null) {
    console.log(error.stack);
  }
});

app.on('ready', () => {
  const SQLBossApplication = require('./sqlboss-application');
  (new SQLBossApplication).initialize();
});

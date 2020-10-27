const secrets = {
  key: null,
};

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
process.nextTick(async () => {
  console.log('loading secrets...');
  await wait(5000);
  // Set secret key
  process.env.KEY = 'something secret';
  secrets.key = 'something secret';
  console.log('done');
});

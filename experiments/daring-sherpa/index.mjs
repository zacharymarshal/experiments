import getSecrets from './secrets.mjs';
import { datastores, init as initDatastores } from './datastores.mjs';
import startApp from './startApp.mjs';

(async () => {
  const secrets = await getSecrets();
  initDatastores(secrets);
  console.log(datastores);
  startApp();
})();

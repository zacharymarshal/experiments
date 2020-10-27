import { datastores } from './datastores.mjs';

export default function() {
  console.log('starting app...');
  console.log(datastores.db);
};

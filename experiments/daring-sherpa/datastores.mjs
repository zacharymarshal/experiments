import { createDb } from './db.mjs';

export const datastores = {};

export function init(secrets) {
  datastores.db = createDb(secrets.key);
};

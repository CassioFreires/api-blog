import dotenv from 'dotenv';
dotenv.config(); // carrega as variáveis do .env

import path = require('path');
import knex from 'knex';

export const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    // parâmetros extras de pool
  },
  pool: { min: 2, max: 10, idleTimeoutMillis: 30000 },
});



export default db;

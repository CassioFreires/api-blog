import dotenv from 'dotenv';
dotenv.config(); // carrega as variáveis do .env

import path = require('path');
import knex from 'knex';

const rootDir = path.resolve(__dirname, '..')


export const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'blog',
  }
});



export default db;

require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'moveis',
    },
    migrations: { directory: './src/migrations', extension: 'js' },
    seeds: { directory: './src/seeds', extension: 'js' },
  },

  hml: {
    client: 'pg',
    connection: {
      host: process.env.HML_DB_HOST || 'localhost',
      port: process.env.HML_DB_PORT ? parseInt(process.env.HML_DB_PORT) : 5432,
      user: process.env.HML_DB_USERNAME || 'postgres',
      password: process.env.HML_DB_PASSWORD || '',
      database: process.env.HML_DB_DATABASE || 'blog_hml',
    },
    migrations: {
      directory: './src/migrations',
      extension: 'js',
    },
    seeds: {
      directory: './src/seeds/hml',
      extension: 'js',
    },
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.PROD_DB_HOST,
      port: process.env.PROD_DB_PORT ? parseInt(process.env.PROD_DB_PORT) : 5432,
      user: process.env.PROD_DB_USERNAME,
      password: process.env.PROD_DB_PASSWORD,
      database: process.env.PROD_DB_DATABASE,
    },
    migrations: {
      directory: './src/migrations',
      extension: 'js',
    },
    seeds: {
      directory: './src/seeds/prod',
      extension: 'js',
    },
  },
};

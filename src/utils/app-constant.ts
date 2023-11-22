import 'dotenv/config';

export const AppConstant = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_BASE_PATH: process.env.API_BASE_PATH || 'api',

  // DATABASE
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
});

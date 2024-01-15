import 'dotenv/config';

export const AppConstant = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_BASE_PATH: process.env.API_BASE_PATH || '',
  SALT: Number(process.env.SALT) || 10,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRED_TIME: Number(process.env.JWT_EXPIRED_TIME) || 60,
  WEB_API_KEY: process.env.WEB_API_KEY,
  MOBILE_API_KEY: process.env.MOBILE_API_KEY,

  // DATABASE
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,

  // REDIS
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_AUTH_KEY: 'AuthToken::',
  REDIS_RES_KEY: 'ResToken::',
  // REDIS_PRODUCT_KEY: 'Product::',

  //IMGBB
  IMGBB_API_V1_KEY: process.env.IMGBB_API_V1_KEY,
});

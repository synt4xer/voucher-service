import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { AppConstant } from '../utils/app-constant';

const pool = new Pool({
  host: AppConstant.DB_HOST,
  port: AppConstant.DB_PORT,
  user: AppConstant.DB_USER,
  password: AppConstant.DB_PASSWORD,
  database: AppConstant.DB_DATABASE,
});

const db = drizzle(pool, { logger: true });

export default db;

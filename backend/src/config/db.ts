import { Pool } from 'pg';
import { env } from './env';

const connectionString =
  env.NODE_ENV === 'test' ? env.TEST_DATABASE_URL ?? env.DATABASE_URL : env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: connectionString?.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
});

export async function testConnection(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('SELECT NOW()');
    console.log('✅ Database connection established');
  } finally {
    client.release();
  }
}

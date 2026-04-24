import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

neonConfig.fetchConnectionCache = true;

// Use a mock fallback URL so the instance doesn't crash on boot in development
// if DATABASE_URL is not yet provided by the user.
const sql = neon(process.env.DATABASE_URL || 'postgres://dummy:dummy@dummy.neon.tech/dummy?sslmode=require');
export const db = drizzle(sql, { schema });

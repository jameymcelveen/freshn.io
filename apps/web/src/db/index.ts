import 'server-only';
import { loadEnvConfig } from '@next/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const connectionString = process.env.DATABASE_POSTGRES_URL;

if (!connectionString && process.env.NODE_ENV === 'production') {
  console.warn("⚠️ DATABASE_POSTGRES_URL is missing!");
}

const client = postgres(connectionString || "postgres://localhost/placeholder");
export const db = drizzle(client, { schema });

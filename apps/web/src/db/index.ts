import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Use the connection string from your .env.local
const connectionString = process.env.DATABASE_POSTGRES_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
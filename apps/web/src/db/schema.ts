import { pgTable, text, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';

export const workstations = pgTable('workstations', {
    id: uuid('id').defaultRandom().primaryKey(),
    hostname: text('hostname').notNull().unique(), // Unique so we can "upsert"
    os: text('os').notNull(),
    packages: jsonb('packages').$type<string[]>().default([]),
    lastSeen: timestamp('last_seen').defaultNow().notNull(),
});
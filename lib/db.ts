import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Koneksi ke Supabase
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);

// Contoh Skema untuk Transaksi Kopi
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  item: text('item').notNull(),
  amount: integer('amount').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

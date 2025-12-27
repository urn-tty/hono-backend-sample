import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core';

/**
 * Drizzle ORM スキーマ定義
 * Infrastructure層 - データベースの詳細
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type UserSchema = typeof users.$inferSelect;
export type NewUserSchema = typeof users.$inferInsert;


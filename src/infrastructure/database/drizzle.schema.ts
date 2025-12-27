import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Drizzle ORM スキーマ定義
 * Infrastructure層 - データベースの詳細
 */
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export type UserSchema = typeof users.$inferSelect;
export type NewUserSchema = typeof users.$inferInsert;


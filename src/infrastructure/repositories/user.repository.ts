import { eq } from "drizzle-orm";
import { User } from "../../domain/entities/user.entity";
import type { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { db } from "../database/db";
import { users } from "../database/drizzle.schema";

/**
 * User リポジトリ実装
 * Infrastructure層 - データベースアクセスの実装
 */
export class UserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    if (user.id === null) {
      // 新規作成
      const result = await db
        .insert(users)
        .values({
          name: user.name,
          email: user.email,
        })
        .returning();

      const newUser = result[0];
      return User.reconstruct(
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.createdAt,
      );
    } else {
      // 更新
      const result = await db
        .update(users)
        .set({
          name: user.name,
          email: user.email,
        })
        .where(eq(users.id, user.id))
        .returning();

      if (result.length === 0) {
        throw new Error(`User with id ${user.id} not found`);
      }

      const updatedUser = result[0];
      return User.reconstruct(
        updatedUser.id,
        updatedUser.name,
        updatedUser.email,
        updatedUser.createdAt,
      );
    }
  }

  async findById(id: number): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    return User.reconstruct(user.id, user.name, user.email, user.createdAt);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    return User.reconstruct(user.id, user.name, user.email, user.createdAt);
  }

  async findAll(): Promise<User[]> {
    const result = await db.select().from(users);
    return result.map((user) =>
      User.reconstruct(user.id, user.name, user.email, user.createdAt),
    );
  }

  async delete(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}

import { eq } from "drizzle-orm";
import { Todo } from "../../domain/entities/todo.entity";
import type { ITodoRepository } from "../../domain/repositories/todo.repository.interface";
import { db } from "../database/db";
import { todos } from "../database/drizzle.schema";

/**
 * Todo リポジトリ実装
 * Infrastructure層 - データベースアクセスの実装
 */
export class TodoRepository implements ITodoRepository {
  async save(todo: Todo): Promise<Todo> {
    if (todo.id === null) {
      // 新規作成
      const result = await db
        .insert(todos)
        .values({
          title: todo.title,
          completed: todo.completed,
          userId: todo.userId,
        })
        .returning();

      const newTodo = result[0];
      return Todo.reconstruct(
        newTodo.id,
        newTodo.title,
        newTodo.completed,
        newTodo.userId,
        newTodo.createdAt,
        newTodo.updatedAt,
      );
    } else {
      // 更新
      const result = await db
        .update(todos)
        .set({
          title: todo.title,
          completed: todo.completed,
          updatedAt: new Date(),
        })
        .where(eq(todos.id, todo.id))
        .returning();

      if (result.length === 0) {
        throw new Error(`Todo with id ${todo.id} not found`);
      }

      const updatedTodo = result[0];
      return Todo.reconstruct(
        updatedTodo.id,
        updatedTodo.title,
        updatedTodo.completed,
        updatedTodo.userId,
        updatedTodo.createdAt,
        updatedTodo.updatedAt,
      );
    }
  }

  async findById(id: number): Promise<Todo | null> {
    const result = await db
      .select()
      .from(todos)
      .where(eq(todos.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const todo = result[0];
    return Todo.reconstruct(
      todo.id,
      todo.title,
      todo.completed,
      todo.userId,
      todo.createdAt,
      todo.updatedAt,
    );
  }

  async findAll(): Promise<Todo[]> {
    const result = await db.select().from(todos);
    return result.map((todo) =>
      Todo.reconstruct(
        todo.id,
        todo.title,
        todo.completed,
        todo.userId,
        todo.createdAt,
        todo.updatedAt,
      ),
    );
  }

  async findByUserId(userId: number): Promise<Todo[]> {
    const result = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId));

    return result.map((todo) =>
      Todo.reconstruct(
        todo.id,
        todo.title,
        todo.completed,
        todo.userId,
        todo.createdAt,
        todo.updatedAt,
      ),
    );
  }

  async delete(id: number): Promise<void> {
    await db.delete(todos).where(eq(todos.id, id));
  }
}

import type { Todo } from "../entities/todo.entity";

export interface ITodoRepository {
  save(todo: Todo): Promise<Todo>;
  findById(id: number): Promise<Todo | null>;
  findAll(): Promise<Todo[]>;
  findByUserId(userId: number): Promise<Todo[]>;
  delete(id: number): Promise<void>;
}

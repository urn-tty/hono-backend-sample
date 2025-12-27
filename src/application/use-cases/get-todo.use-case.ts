import type { Todo } from "../../domain/entities/todo.entity";
import { TodoNotFoundError } from "../../domain/errors/domain.error";
import type { ITodoRepository } from "../../domain/repositories/todo.repository.interface";

/**
 * Todo取得ユースケース
 */
export class GetTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);

    if (!todo) {
      throw new TodoNotFoundError(id);
    }

    return todo;
  }
}

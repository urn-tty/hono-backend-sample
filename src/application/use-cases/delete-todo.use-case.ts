import { TodoNotFoundError } from "../../domain/errors/domain.error";
import type { ITodoRepository } from "../../domain/repositories/todo.repository.interface";

/**
 * Todo削除ユースケース
 */
export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(id: number): Promise<void> {
    // Todoの存在確認
    const todo = await this.todoRepository.findById(id);

    if (!todo) {
      throw new TodoNotFoundError(id);
    }

    // 削除実行
    await this.todoRepository.delete(id);
  }
}

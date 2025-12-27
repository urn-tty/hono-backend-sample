import type { Todo } from "../../domain/entities/todo.entity";
import type { ITodoRepository } from "../../domain/repositories/todo.repository.interface";

/**
 * Todo一覧取得ユースケース
 */
export class ListTodosUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(userId?: number): Promise<Todo[]> {
    // userIdが指定されていれば、そのユーザーのTodoのみ取得
    if (userId) {
      return await this.todoRepository.findByUserId(userId);
    }

    // 指定されていなければ全件取得
    return await this.todoRepository.findAll();
  }
}

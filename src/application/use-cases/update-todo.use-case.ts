import type { Todo } from "../../domain/entities/todo.entity";
import { TodoNotFoundError } from "../../domain/errors/domain.error";
import type { ITodoRepository } from "../../domain/repositories/todo.repository.interface";
import type { UpdateTodoDto } from "../dto/todo.dto";

/**
 * Todo更新ユースケース
 */
export class UpdateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(id: number, dto: UpdateTodoDto): Promise<Todo> {
    // 既存のTodoを取得
    const existingTodo = await this.todoRepository.findById(id);

    if (!existingTodo) {
      throw new TodoNotFoundError(id);
    }

    // 更新された内容でエンティティを作り直す
    let updatedTodo = existingTodo;

    if (dto.title !== undefined) {
      updatedTodo = updatedTodo.updateTitle(dto.title);
    }

    if (dto.completed !== undefined) {
      updatedTodo = updatedTodo.updateCompleted(dto.completed);
    }

    // リポジトリに保存
    return await this.todoRepository.save(updatedTodo);
  }
}

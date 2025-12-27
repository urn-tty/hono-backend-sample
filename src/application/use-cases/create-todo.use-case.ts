import { Todo } from "../../domain/entities/todo.entity";
import type { ITodoRepository } from "../../domain/repositories/todo.repository.interface";
import type { CreateTodoDto } from "../dto/todo.dto";

/**
 * Todo作成ユースケース
 */
export class CreateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(dto: CreateTodoDto): Promise<Todo> {
    // エンティティを作成
    const todo = Todo.create(dto.title, dto.userId);

    // リポジトリに保存
    return await this.todoRepository.save(todo);
  }
}

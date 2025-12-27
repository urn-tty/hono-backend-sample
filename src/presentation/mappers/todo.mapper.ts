import type { TodoResponseDto } from "../../application/dto/todo.dto";
import type { Todo } from "../../domain/entities/todo.entity";

/**
 * Todo マッパー
 * Presentation層 - エンティティをDTOに変換
 */
export function todoToDto(todo: Todo): TodoResponseDto {
  if (todo.id === null || todo.id === undefined) {
    throw new Error("Todo id is required for DTO mapping");
  }

  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    userId: todo.userId,
    createdAt: todo.createdAt?.toISOString() ?? "",
    updatedAt: todo.updatedAt?.toISOString() ?? "",
  };
}

/**
 * エンティティ配列をDTO配列に変換
 */
export function todosToDtoList(todos: Todo[]): TodoResponseDto[] {
  return todos.map((todo) => todoToDto(todo));
}

// 後方互換性のため、以前のクラスベースの名前も保持
export const TodoMapper = {
  toDto: todoToDto,
  toDtoList: todosToDtoList,
};

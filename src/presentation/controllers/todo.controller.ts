import type { Context } from "hono";
import {
  CreateTodoDtoSchema,
  UpdateTodoDtoSchema,
} from "../../application/dto/todo.dto";
import type { CreateTodoUseCase } from "../../application/use-cases/create-todo.use-case";
import type { DeleteTodoUseCase } from "../../application/use-cases/delete-todo.use-case";
import type { GetTodoUseCase } from "../../application/use-cases/get-todo.use-case";
import type { ListTodosUseCase } from "../../application/use-cases/list-todos.use-case";
import type { UpdateTodoUseCase } from "../../application/use-cases/update-todo.use-case";
import { TodoNotFoundError } from "../../domain/errors/domain.error";
import { TodoMapper } from "../mappers/todo.mapper";

/**
 * Todoコントローラー
 * Presentation層 - HTTPリクエストの処理
 */
export class TodoController {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly getTodoUseCase: GetTodoUseCase,
    private readonly listTodosUseCase: ListTodosUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    private readonly deleteTodoUseCase: DeleteTodoUseCase,
  ) {}

  async list(c: Context) {
    try {
      // クエリパラメータからuserIdを取得（オプション）
      const userIdParam = c.req.query("userId");
      const userId = userIdParam ? parseInt(userIdParam, 10) : undefined;

      const todos = await this.listTodosUseCase.execute(userId);
      return c.json(TodoMapper.toDtoList(todos));
    } catch (_error) {
      return c.json({ error: "Failed to fetch todos" }, 500);
    }
  }

  async get(c: Context) {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (Number.isNaN(id)) {
        return c.json({ error: "Invalid ID" }, 400);
      }

      const todo = await this.getTodoUseCase.execute(id);
      return c.json(TodoMapper.toDto(todo));
    } catch (error) {
      if (error instanceof TodoNotFoundError) {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: "Failed to fetch todo" }, 500);
    }
  }

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const dto = CreateTodoDtoSchema.parse(body);

      const todo = await this.createTodoUseCase.execute(dto);
      return c.json(TodoMapper.toDto(todo), 201);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "ZodError"
      ) {
        return c.json(
          {
            error: "Validation error",
            details: (error as { errors: unknown }).errors,
          },
          400,
        );
      }
      return c.json({ error: "Failed to create todo" }, 500);
    }
  }

  async update(c: Context) {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (Number.isNaN(id)) {
        return c.json({ error: "Invalid ID" }, 400);
      }

      const body = await c.req.json();
      const dto = UpdateTodoDtoSchema.parse(body);

      const todo = await this.updateTodoUseCase.execute(id, dto);
      return c.json(TodoMapper.toDto(todo));
    } catch (error: unknown) {
      if (error instanceof TodoNotFoundError) {
        return c.json({ error: error.message }, 404);
      }
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "ZodError"
      ) {
        return c.json(
          {
            error: "Validation error",
            details: (error as { errors: unknown }).errors,
          },
          400,
        );
      }
      return c.json({ error: "Failed to update todo" }, 500);
    }
  }

  async delete(c: Context) {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (Number.isNaN(id)) {
        return c.json({ error: "Invalid ID" }, 400);
      }

      await this.deleteTodoUseCase.execute(id);
      return c.json({ message: "Todo deleted successfully" });
    } catch (error) {
      if (error instanceof TodoNotFoundError) {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: "Failed to delete todo" }, 500);
    }
  }
}

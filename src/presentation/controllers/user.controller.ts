import type { Context } from "hono";
import {
  CreateUserDtoSchema,
  UpdateUserDtoSchema,
} from "../../application/dto/user.dto";
import type { CreateUserUseCase } from "../../application/use-cases/create-user.use-case";
import type { DeleteUserUseCase } from "../../application/use-cases/delete-user.use-case";
import type { GetUserUseCase } from "../../application/use-cases/get-user.use-case";
import type { ListUsersUseCase } from "../../application/use-cases/list-users.use-case";
import type { UpdateUserUseCase } from "../../application/use-cases/update-user.use-case";
import {
  EmailAlreadyExistsError,
  UserNotFoundError,
} from "../../domain/errors/domain.error";
import { UserMapper } from "../mappers/user.mapper";

/**
 * ユーザーコントローラー
 * Presentation層 - HTTPリクエストの処理
 */
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  async list(c: Context) {
    try {
      const users = await this.listUsersUseCase.execute();
      return c.json(UserMapper.toDtoList(users));
    } catch (_error) {
      return c.json({ error: "Failed to fetch users" }, 500);
    }
  }

  async get(c: Context) {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (Number.isNaN(id)) {
        return c.json({ error: "Invalid ID" }, 400);
      }

      const user = await this.getUserUseCase.execute(id);
      return c.json(UserMapper.toDto(user));
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: "Failed to fetch user" }, 500);
    }
  }

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const dto = CreateUserDtoSchema.parse(body);

      const user = await this.createUserUseCase.execute(dto);
      return c.json(UserMapper.toDto(user), 201);
    } catch (error: unknown) {
      if (error instanceof EmailAlreadyExistsError) {
        return c.json({ error: error.message }, 409);
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
      return c.json({ error: "Failed to create user" }, 500);
    }
  }

  async update(c: Context) {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (Number.isNaN(id)) {
        return c.json({ error: "Invalid ID" }, 400);
      }

      const body = await c.req.json();
      const dto = UpdateUserDtoSchema.parse(body);

      const user = await this.updateUserUseCase.execute(id, dto);
      return c.json(UserMapper.toDto(user));
    } catch (error: unknown) {
      if (error instanceof UserNotFoundError) {
        return c.json({ error: error.message }, 404);
      }
      if (error instanceof EmailAlreadyExistsError) {
        return c.json({ error: error.message }, 409);
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
      return c.json({ error: "Failed to update user" }, 500);
    }
  }

  async delete(c: Context) {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (Number.isNaN(id)) {
        return c.json({ error: "Invalid ID" }, 400);
      }

      await this.deleteUserUseCase.execute(id);
      return c.json({ message: "User deleted successfully" });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: "Failed to delete user" }, 500);
    }
  }
}

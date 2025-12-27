/**
 * 依存性注入コンテナ
 * 各層の依存関係を管理
 */

import { CreateUserUseCase } from "../application/use-cases/create-user.use-case";
import { DeleteUserUseCase } from "../application/use-cases/delete-user.use-case";
import { GetUserUseCase } from "../application/use-cases/get-user.use-case";
import { ListUsersUseCase } from "../application/use-cases/list-users.use-case";
import { UpdateUserUseCase } from "../application/use-cases/update-user.use-case";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { UserController } from "../presentation/controllers/user.controller";

// リポジトリの作成
const userRepository = new UserRepository();

// ユースケースの作成
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

// コントローラーの作成
export const userController = new UserController(
  createUserUseCase,
  getUserUseCase,
  listUsersUseCase,
  updateUserUseCase,
  deleteUserUseCase,
);

// Todo関連のインポート
import { CreateTodoUseCase } from "../application/use-cases/create-todo.use-case";
import { DeleteTodoUseCase } from "../application/use-cases/delete-todo.use-case";
import { GetTodoUseCase } from "../application/use-cases/get-todo.use-case";
import { ListTodosUseCase } from "../application/use-cases/list-todos.use-case";
import { UpdateTodoUseCase } from "../application/use-cases/update-todo.use-case";
import { TodoRepository } from "../infrastructure/repositories/todo.repository";
import { TodoController } from "../presentation/controllers/todo.controller";

// Todoリポジトリの作成
const todoRepository = new TodoRepository();

// Todoユースケースの作成
const createTodoUseCase = new CreateTodoUseCase(todoRepository);
const getTodoUseCase = new GetTodoUseCase(todoRepository);
const listTodosUseCase = new ListTodosUseCase(todoRepository);
const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);

// Todoコントローラーの作成
export const todoController = new TodoController(
  createTodoUseCase,
  getTodoUseCase,
  listTodosUseCase,
  updateTodoUseCase,
  deleteTodoUseCase,
);

/**
 * 依存性注入コンテナ
 * 各層の依存関係を管理
 */
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { CreateUserUseCase } from "../application/use-cases/create-user.use-case";
import { GetUserUseCase } from "../application/use-cases/get-user.use-case";
import { ListUsersUseCase } from "../application/use-cases/list-users.use-case";
import { UpdateUserUseCase } from "../application/use-cases/update-user.use-case";
import { DeleteUserUseCase } from "../application/use-cases/delete-user.use-case";
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
  deleteUserUseCase
);

import type { User } from "../../domain/entities/user.entity";
import type { IUserRepository } from "../../domain/repositories/user.repository.interface";

/**
 * ユーザー一覧取得ユースケース
 */
export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}

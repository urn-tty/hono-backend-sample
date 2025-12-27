import type { User } from "../../domain/entities/user.entity";
import { UserNotFoundError } from "../../domain/errors/domain.error";
import type { IUserRepository } from "../../domain/repositories/user.repository.interface";

/**
 * ユーザー取得ユースケース
 */
export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }
    return user;
  }
}

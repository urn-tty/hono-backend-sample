import { UserNotFoundError } from "../../domain/errors/domain.error";
import type { IUserRepository } from "../../domain/repositories/user.repository.interface";

/**
 * ユーザー削除ユースケース
 */
export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<void> {
    // ユーザーの存在確認
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // 削除実行
    await this.userRepository.delete(id);
  }
}

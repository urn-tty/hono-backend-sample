import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserNotFoundError, EmailAlreadyExistsError } from '../../domain/errors/domain.error';
import { UpdateUserDto } from '../dto/user.dto';

/**
 * ユーザー更新ユースケース
 */
export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number, dto: UpdateUserDto): Promise<User> {
    // 既存ユーザーを取得
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new UserNotFoundError(id);
    }

    // メールアドレスの重複チェック（変更がある場合）
    if (dto.email && dto.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(dto.email);
      if (userWithEmail) {
        throw new EmailAlreadyExistsError(dto.email);
      }
    }

    // エンティティを更新
    let updatedUser = existingUser;
    if (dto.name) {
      updatedUser = updatedUser.updateName(dto.name);
    }
    if (dto.email) {
      updatedUser = updatedUser.updateEmail(dto.email);
    }

    // リポジトリに保存
    return await this.userRepository.save(updatedUser);
  }
}


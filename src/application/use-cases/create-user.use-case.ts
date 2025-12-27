import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { EmailAlreadyExistsError } from '../../domain/errors/domain.error';
import { CreateUserDto } from '../dto/user.dto';

/**
 * ユーザー作成ユースケース
 */
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // メールアドレスの重複チェック
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new EmailAlreadyExistsError(dto.email);
    }

    // エンティティを作成
    const user = User.create(dto.name, dto.email);

    // リポジトリに保存
    return await this.userRepository.save(user);
  }
}


import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../../application/dto/user.dto';

/**
 * エンティティとDTOのマッピング
 * Presentation層 - ドメインとHTTPの変換
 */
export class UserMapper {
  static toDto(user: User): UserResponseDto {
    if (user.id === null) {
      throw new Error('User id is required for DTO mapping');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    };
  }

  static toDtoList(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toDto(user));
  }
}


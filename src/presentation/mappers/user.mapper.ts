import type { UserResponseDto } from "../../application/dto/user.dto";
import type { User } from "../../domain/entities/user.entity";

/**
 * エンティティとDTOのマッピング
 * Presentation層 - ドメインとHTTPの変換
 */
export function userToDto(user: User): UserResponseDto {
  if (user.id === null || user.id === undefined) {
    throw new Error("User id is required for DTO mapping");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
  };
}

/**
 * エンティティ配列をDTO配列に変換
 */
export function usersToDtoList(users: User[]): UserResponseDto[] {
  return users.map((user) => userToDto(user));
}

// 後方互換性のため、以前のクラスベースの名前も保持
export const UserMapper = {
  toDto: userToDto,
  toDtoList: usersToDtoList,
};

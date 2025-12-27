import type { User } from "../entities/user.entity";

/**
 * User リポジトリインターフェース
 * ドメイン層 - 実装の詳細に依存しない抽象化
 */
export interface IUserRepository {
  /**
   * ユーザーを保存
   */
  save(user: User): Promise<User>;

  /**
   * IDでユーザーを検索
   */
  findById(id: number): Promise<User | null>;

  /**
   * メールアドレスでユーザーを検索
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * 全ユーザーを取得
   */
  findAll(): Promise<User[]>;

  /**
   * ユーザーを削除
   */
  delete(id: number): Promise<void>;
}

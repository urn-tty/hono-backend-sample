/**
 * User エンティティ
 * ドメイン層 - ビジネスロジックの中核
 */
export class User {
  private constructor(
    public readonly id: number | null,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date | null = null
  ) {
    this.validate();
  }

  /**
   * エンティティのバリデーション
   */
  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("User name is required");
    }
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error("Valid email is required");
    }
  }

  /**
   * メールアドレスのバリデーション
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 新しいユーザーを作成（IDなし）
   */
  static create(name: string, email: string): User {
    return new User(null, name, email, null);
  }

  /**
   * 既存のユーザーを再構築（IDあり）
   */
  static reconstruct(
    id: number,
    name: string,
    email: string,
    createdAt: Date | null = null
  ): User {
    return new User(id, name, email, createdAt);
  }

  /**
   * 名前を更新
   */
  updateName(name: string): User {
    return new User(this.id, name, this.email, this.createdAt);
  }

  /**
   * メールアドレスを更新
   */
  updateEmail(email: string): User {
    return new User(this.id, this.name, email, this.createdAt);
  }

  /**
   * エンティティの等価性チェック
   */
  equals(other: User): boolean {
    return this.id !== null && other.id !== null && this.id === other.id;
  }
}

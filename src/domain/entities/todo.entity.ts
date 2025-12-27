/**
 * Todo エンティティ
 * ドメイン層 - ビジネスロジックの中核
 */
export class Todo {
  private constructor(
    public readonly id: number | null,
    public readonly title: string,
    public readonly completed: boolean,
    public readonly userId: number,
    public readonly createdAt: Date | null = null,
    public readonly updatedAt: Date | null = null,
  ) {
    this.validate();
  }

  /**
   * エンティティのバリデーション
   */
  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error("Title is required");
    }
    if (!this.userId || this.userId <= 0) {
      throw new Error("User ID is required");
    }
  }

  /**
   * 新しいTodoを作成（IDなし）
   */
  static create(title: string, userId: number): Todo {
    return new Todo(null, title, false, userId, null, null);
  }

  /**
   * 既存のTodoを再構築（IDあり）
   */
  static reconstruct(
    id: number,
    title: string,
    completed: boolean,
    userId: number,
    createdAt: Date | null = null,
    updatedAt: Date | null = null,
  ): Todo {
    return new Todo(id, title, completed, userId, createdAt, updatedAt);
  }

  /**
   * タイトルを更新
   */
  updateTitle(title: string): Todo {
    return new Todo(
      this.id,
      title,
      this.completed,
      this.userId,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * 完了状態を更新
   */
  updateCompleted(completed: boolean): Todo {
    return new Todo(
      this.id,
      this.title,
      completed,
      this.userId,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * 完了状態をトグル
   */
  toggleCompleted(): Todo {
    return this.updateCompleted(!this.completed);
  }

  /**
   * エンティティの等価性チェック
   */
  equals(other: Todo): boolean {
    return this.id !== null && other.id !== null && this.id === other.id;
  }
}

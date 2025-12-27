/**
 * ドメインエラーの基底クラス
 */
export abstract class DomainError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * ユーザーが見つからない場合のエラー
 */
export class UserNotFoundError extends DomainError {
  constructor(id: number) {
    super(`User with id ${id} not found`, 'USER_NOT_FOUND');
  }
}

/**
 * メールアドレスが既に存在する場合のエラー
 */
export class EmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`Email ${email} already exists`, 'EMAIL_ALREADY_EXISTS');
  }
}


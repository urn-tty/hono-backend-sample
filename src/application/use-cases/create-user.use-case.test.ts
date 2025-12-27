import { describe, expect, mock, test } from "bun:test";
import { User } from "../../domain/entities/user.entity";
import { EmailAlreadyExistsError } from "../../domain/errors/domain.error";
import type { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { CreateUserUseCase } from "./create-user.use-case";

describe("CreateUserUseCase", () => {
  test("新しいユーザーを作成できる", async () => {
    const mockRepository: IUserRepository = {
      findByEmail: mock(() => Promise.resolve(null)),
      save: mock((user: User) =>
        Promise.resolve(User.reconstruct(1, user.name, user.email, new Date())),
      ),
      findById: mock(() => Promise.resolve(null)),
      findAll: mock(() => Promise.resolve([])),
      update: mock(() => Promise.resolve({} as User)),
      delete: mock(() => Promise.resolve()),
    };

    const useCase = new CreateUserUseCase(mockRepository);
    const result = await useCase.execute({
      name: "Test User",
      email: "test@example.com",
    });

    expect(result.id).toBe(1);
    expect(result.name).toBe("Test User");
    expect(result.email).toBe("test@example.com");
    expect(mockRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
    expect(mockRepository.save).toHaveBeenCalled();
  });

  test("既存のメールアドレスでユーザー作成しようとするとエラーを投げる", async () => {
    const existingUser = User.reconstruct(
      1,
      "Existing User",
      "test@example.com",
    );

    const mockRepository: IUserRepository = {
      findByEmail: mock(() => Promise.resolve(existingUser)),
      save: mock(() => Promise.resolve({} as User)),
      findById: mock(() => Promise.resolve(null)),
      findAll: mock(() => Promise.resolve([])),
      update: mock(() => Promise.resolve({} as User)),
      delete: mock(() => Promise.resolve()),
    };

    const useCase = new CreateUserUseCase(mockRepository);

    await expect(
      useCase.execute({
        name: "Test User",
        email: "test@example.com",
      }),
    ).rejects.toThrow(EmailAlreadyExistsError);

    expect(mockRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});

import { describe, expect, test } from "bun:test";
import { User } from "./user.entity";

describe("User Entity", () => {
  describe("create", () => {
    test("正しい名前とメールアドレスでユーザーを作成できる", () => {
      const user = User.create("Test User", "test@example.com");

      expect(user.name).toBe("Test User");
      expect(user.email).toBe("test@example.com");
      expect(user.id).toBeNull();
      expect(user.createdAt).toBeNull();
    });

    test("名前が空の場合はエラーを投げる", () => {
      expect(() => {
        User.create("", "test@example.com");
      }).toThrow("User name is required");
    });

    test("無効なメールアドレスの場合はエラーを投げる", () => {
      expect(() => {
        User.create("Test User", "invalid-email");
      }).toThrow("Valid email is required");
    });

    test("メールアドレスが空の場合はエラーを投げる", () => {
      expect(() => {
        User.create("Test User", "");
      }).toThrow("Valid email is required");
    });
  });

  describe("reconstruct", () => {
    test("既存のユーザーを再構築できる", () => {
      const user = User.reconstruct(1, "Test User", "test@example.com");

      expect(user.id).toBe(1);
      expect(user.name).toBe("Test User");
      expect(user.email).toBe("test@example.com");
      expect(user.createdAt).toBeNull();
    });

    test("作成日時を指定して再構築できる", () => {
      const createdAt = new Date("2024-01-01");
      const user = User.reconstruct(
        1,
        "Test User",
        "test@example.com",
        createdAt,
      );

      expect(user.createdAt).toEqual(createdAt);
    });
  });

  describe("updateName", () => {
    test("名前を更新できる", () => {
      const user = User.reconstruct(1, "Old Name", "test@example.com");
      const updatedUser = user.updateName("New Name");

      expect(updatedUser.name).toBe("New Name");
      expect(updatedUser.email).toBe("test@example.com");
      expect(updatedUser.id).toBe(1);
    });
  });

  describe("updateEmail", () => {
    test("メールアドレスを更新できる", () => {
      const user = User.reconstruct(1, "Test User", "old@example.com");
      const updatedUser = user.updateEmail("new@example.com");

      expect(updatedUser.email).toBe("new@example.com");
      expect(updatedUser.name).toBe("Test User");
      expect(updatedUser.id).toBe(1);
    });
  });

  describe("equals", () => {
    test("同じIDを持つユーザーは等価と判定される", () => {
      const user1 = User.reconstruct(1, "User 1", "user1@example.com");
      const user2 = User.reconstruct(1, "User 2", "user2@example.com");

      expect(user1.equals(user2)).toBe(true);
    });

    test("異なるIDを持つユーザーは等価と判定されない", () => {
      const user1 = User.reconstruct(1, "User 1", "user1@example.com");
      const user2 = User.reconstruct(2, "User 1", "user1@example.com");

      expect(user1.equals(user2)).toBe(false);
    });

    test("IDがnullのユーザーは等価と判定されない", () => {
      const user1 = User.create("User 1", "user1@example.com");
      const user2 = User.create("User 1", "user1@example.com");

      expect(user1.equals(user2)).toBe(false);
    });
  });
});

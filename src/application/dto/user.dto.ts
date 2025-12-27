import { z } from "zod";

/**
 * ユーザー作成用DTO
 */
export const CreateUserDtoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

/**
 * ユーザー更新用DTO
 */
export const UpdateUserDtoSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;

/**
 * ユーザーレスポンスDTO
 */
export const UserResponseDtoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
});

export type UserResponseDto = z.infer<typeof UserResponseDtoSchema>;

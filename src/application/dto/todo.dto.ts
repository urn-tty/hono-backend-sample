import { z } from "zod";

/**
 * Todo作成用DTO
 */

export const CreateTodoDtoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  userId: z.number().int().positive(),
});

export type CreateTodoDto = z.infer<typeof CreateTodoDtoSchema>;

/**
 * Todo更新用DTO
 */
export const UpdateTodoDtoSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  completed: z.boolean().optional(),
});

export type UpdateTodoDto = z.infer<typeof UpdateTodoDtoSchema>;

/**
 * Todo応答用のDTO（APIレスポンス）
 */
export const TodoResponseDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
  userId: z.number(),
  createdAt: z.string(), // ← Date型ではなくstring型！
  updatedAt: z.string(), // ← Date型ではなくstring型！
});

export type TodoResponseDto = z.infer<typeof TodoResponseDtoSchema>;

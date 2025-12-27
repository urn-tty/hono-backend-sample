import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  CreateUserDtoSchema,
  UpdateUserDtoSchema,
  UserResponseDtoSchema,
} from "../../application/dto/user.dto";
import type { UserController } from "../controllers/user.controller";

/**
 * エラーレスポンススキーマ
 */
const ErrorSchema = z.object({
  error: z.string(),
  details: z.any().optional(),
});

/**
 * パラメータスキーマ
 */
const UserIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

/**
 * OpenAPI対応のユーザールート
 */
export function createUserOpenAPIRoutes(controller: UserController) {
  const app = new OpenAPIHono();

  // ユーザー一覧取得
  app.openapi(
    createRoute({
      method: "get",
      path: "/",
      tags: ["Users"],
      summary: "ユーザー一覧取得",
      description: "すべてのユーザーを取得します",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(UserResponseDtoSchema),
            },
          },
          description: "ユーザー一覧",
        },
        500: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "サーバーエラー",
        },
      },
    }),
    // @ts-expect-error - Controller returns multiple status codes
    async (c) => controller.list(c),
  );

  // ユーザー取得
  app.openapi(
    createRoute({
      method: "get",
      path: "/{id}",
      tags: ["Users"],
      summary: "ユーザー取得",
      description: "指定されたIDのユーザーを取得します",
      request: {
        params: UserIdParamSchema,
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: UserResponseDtoSchema,
            },
          },
          description: "ユーザー情報",
        },
        400: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "不正なリクエスト",
        },
        404: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "ユーザーが見つかりません",
        },
        500: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "サーバーエラー",
        },
      },
    }),
    // @ts-expect-error - Controller returns multiple status codes
    async (c) => controller.get(c),
  );

  // ユーザー作成
  app.openapi(
    createRoute({
      method: "post",
      path: "/",
      tags: ["Users"],
      summary: "ユーザー作成",
      description: "新しいユーザーを作成します",
      request: {
        body: {
          content: {
            "application/json": {
              schema: CreateUserDtoSchema,
            },
          },
        },
      },
      responses: {
        201: {
          content: {
            "application/json": {
              schema: UserResponseDtoSchema,
            },
          },
          description: "ユーザーが作成されました",
        },
        400: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "バリデーションエラー",
        },
        409: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "メールアドレスが既に使用されています",
        },
        500: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "サーバーエラー",
        },
      },
    }),
    async (c) => controller.create(c),
  );

  // ユーザー更新
  app.openapi(
    createRoute({
      method: "put",
      path: "/{id}",
      tags: ["Users"],
      summary: "ユーザー更新",
      description: "指定されたIDのユーザー情報を更新します",
      request: {
        params: UserIdParamSchema,
        body: {
          content: {
            "application/json": {
              schema: UpdateUserDtoSchema,
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: UserResponseDtoSchema,
            },
          },
          description: "ユーザーが更新されました",
        },
        400: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "バリデーションエラー",
        },
        404: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "ユーザーが見つかりません",
        },
        409: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "メールアドレスが既に使用されています",
        },
        500: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "サーバーエラー",
        },
      },
    }),
    // @ts-expect-error - Controller returns multiple status codes
    async (c) => controller.update(c),
  );

  // ユーザー削除
  app.openapi(
    createRoute({
      method: "delete",
      path: "/{id}",
      tags: ["Users"],
      summary: "ユーザー削除",
      description: "指定されたIDのユーザーを削除します",
      request: {
        params: UserIdParamSchema,
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                message: z.string(),
              }),
            },
          },
          description: "ユーザーが削除されました",
        },
        400: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "不正なリクエスト",
        },
        404: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "ユーザーが見つかりません",
        },
        500: {
          content: {
            "application/json": {
              schema: ErrorSchema,
            },
          },
          description: "サーバーエラー",
        },
      },
    }),
    // @ts-expect-error - Controller returns multiple status codes
    async (c) => controller.delete(c),
  );

  return app;
}

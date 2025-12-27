import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  CreateTodoDtoSchema,
  TodoResponseDtoSchema,
  UpdateTodoDtoSchema,
} from "../../application/dto/todo.dto";
import type { TodoController } from "../controllers/todo.controller";

// エラーレスポンススキーマ
const ErrorSchema = z.object({
  error: z.string(),
  details: z.any().optional(),
});

// IDパラメータスキーマ
const IdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number"),
});

// クエリパラメータスキーマ
const TodoQuerySchema = z.object({
  userId: z.string().regex(/^\d+$/, "User ID must be a number").optional(),
});

/**
 * GET /todos - Todo一覧取得
 */
const listRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Todos"],
  summary: "Todo一覧取得",
  description: "Todoの一覧を取得します。userIdでフィルタリング可能です。",
  request: {
    query: TodoQuerySchema,
  },
  responses: {
    200: {
      description: "成功",
      content: {
        "application/json": {
          schema: z.array(TodoResponseDtoSchema),
        },
      },
    },
    500: {
      description: "サーバーエラー",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

/**
 * GET /todos/:id - Todo取得
 */
const getRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Todos"],
  summary: "Todo取得",
  description: "指定されたIDのTodoを取得します。",
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      description: "成功",
      content: {
        "application/json": {
          schema: TodoResponseDtoSchema,
        },
      },
    },
    400: {
      description: "不正なリクエスト",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    404: {
      description: "Todoが見つかりません",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "サーバーエラー",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

/**
 * POST /todos - Todo作成
 */
const createTodoRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Todos"],
  summary: "Todo作成",
  description: "新しいTodoを作成します。",
  request: {
    body: {
      description: "Todoの作成データ",
      content: {
        "application/json": {
          schema: CreateTodoDtoSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "作成成功",
      content: {
        "application/json": {
          schema: TodoResponseDtoSchema,
        },
      },
    },
    400: {
      description: "バリデーションエラー",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "サーバーエラー",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

/**
 * PUT /todos/:id - Todo更新
 */
const updateRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Todos"],
  summary: "Todo更新",
  description: "指定されたIDのTodoを更新します。",
  request: {
    params: IdParamSchema,
    body: {
      description: "Todoの更新データ",
      content: {
        "application/json": {
          schema: UpdateTodoDtoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "更新成功",
      content: {
        "application/json": {
          schema: TodoResponseDtoSchema,
        },
      },
    },
    400: {
      description: "不正なリクエスト",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    404: {
      description: "Todoが見つかりません",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "サーバーエラー",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

/**
 * DELETE /todos/:id - Todo削除
 */
const deleteRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Todos"],
  summary: "Todo削除",
  description: "指定されたIDのTodoを削除します。",
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      description: "削除成功",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: "不正なリクエスト",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    404: {
      description: "Todoが見つかりません",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "サーバーエラー",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

/**
 * Todo OpenAPIルート
 */
export function createTodoOpenAPIRoutes(controller: TodoController) {
  const app = new OpenAPIHono();

  app.openapi(listRoute, (c) => controller.list(c));
  app.openapi(getRoute, (c) => controller.get(c));
  app.openapi(createTodoRoute, (c) => controller.create(c));
  app.openapi(updateRoute, (c) => controller.update(c));
  app.openapi(deleteRoute, (c) => controller.delete(c));

  return app;
}

import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { userController } from "./di/container";
import { createUserOpenAPIRoutes } from "./presentation/routes/user.openapi.routes";

type Env = {
  // 環境変数の型定義（必要に応じて追加）
};

const app = new OpenAPIHono<{ Bindings: Env }>();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Health check
app.get("/", (c) => {
  return c.json({
    message: "Hello, Hono!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// User routes (OpenAPI対応)
app.route("/api/users", createUserOpenAPIRoutes(userController));

// OpenAPI仕様のJSONエンドポイント
app.doc("/api/openapi.json", {
  openapi: "3.1.0",
  info: {
    title: "Hono Backend API",
    description:
      "DDD（ドメイン駆動設計）とクリーンアーキテクチャで設計されたバックエンドAPI",
    version: "1.0.0",
  },
  tags: [
    {
      name: "Users",
      description: "ユーザー管理API",
    },
  ],
});

// API ドキュメント（Scalar UI）
app.get(
  "/api/docs",
  apiReference({
    spec: {
      url: "/api/openapi.json",
    },
    theme: "purple",
    layout: "modern",
  })
);

export default app;

// 型エクスポート（必要に応じて使用）
export type AppType = typeof app;

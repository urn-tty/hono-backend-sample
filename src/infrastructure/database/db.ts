import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./drizzle.schema";

// 環境変数からデータベースURLを取得
declare const process: {
  env: {
    DATABASE_URL?: string;
    [key: string]: string | undefined;
  };
};

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/hono_backend_sample";

// PostgreSQL接続を作成（接続オプションを明示的に設定）
const client = postgres(databaseUrl, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

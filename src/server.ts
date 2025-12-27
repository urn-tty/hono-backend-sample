import app from "./index";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// 環境変数からポートを取得（デフォルト: 8080）
// Bunでは process.env が利用可能
declare const process: {
  env: {
    PORT?: string;
    NODE_ENV?: string;
    DATABASE_URL?: string;
    [key: string]: string | undefined;
  };
};

/**
 * 開発環境でマイグレーションを自動実行
 */
async function runMigrationsInDev() {
  // 本番環境ではスキップ（マイグレーションは別途実行）
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const client = postgres(
    process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@postgres:5432/hono_backend_sample",
    {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    },
  );

  const db = drizzle(client);

  try {
    console.log("🔄 Running migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations completed!");
  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    // 開発環境ではマイグレーションエラーでもサーバーを起動
  } finally {
    await client.end();
  }
}

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// 開発環境では起動時にマイグレーションを実行
await runMigrationsInDev();

export default {
  port,
  fetch: app.fetch,
};

console.log(`🚀 Server is running on http://localhost:${port}`);

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./drizzle.schema";

async function runMigrations() {
  const client = postgres(
    process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@postgres:5432/hono_backend_sample",
    {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    },
  );

  const db = drizzle(client, { schema });

  try {
    console.log("Running migrations...");
    console.log("Database URL:", process.env.DATABASE_URL || "not set");

    // 接続テスト
    await client`SELECT 1`;
    console.log("Database connection successful");

    // migrateはPromiseを返すので、awaitで待つ
    await migrate(db, { migrationsFolder: "./drizzle" });

    console.log("Migrations completed!");
    await client.end();
    process.exit(0);
  } catch (error: unknown) {
    console.error("Migration failed:", error);
    if (error && typeof error === "object") {
      if ("message" in error) {
        console.error("Error message:", error.message);
      }
      if ("stack" in error) {
        console.error("Stack:", error.stack);
      }
    }
    await client.end();
    process.exit(1);
  }
}

runMigrations();

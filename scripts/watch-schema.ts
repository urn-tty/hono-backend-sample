import { watch } from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const SCHEMA_PATH = "./src/infrastructure/database/drizzle.schema.ts";

/**
 * スキーマファイルを監視してマイグレーションファイルを自動生成するスクリプト
 * 開発環境で使用します
 */
async function generateMigrations() {
  console.log("🔄 Generating migrations...");
  try {
    const { stdout, stderr } = await execAsync("bun run db:generate");
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log("✅ Migrations generated!");
  } catch (error: any) {
    console.error("❌ Failed to generate migrations:", error.message);
  }
}

console.log(`👀 Watching schema file: ${SCHEMA_PATH}`);
console.log("スキーマファイルを変更すると、自動的にマイグレーションファイルが生成されます");
console.log("Ctrl+C で終了します\n");

// 初回実行
await generateMigrations();

// ファイル監視を開始
const watcher = watch(SCHEMA_PATH, async (eventType, filename) => {
  if (eventType === "change") {
    console.log(`\n📝 ${filename} changed!`);
    await generateMigrations();
  }
});

// プロセス終了時にクリーンアップ
process.on("SIGINT", () => {
  console.log("\n👋 Stopping schema watcher...");
  watcher.close();
  process.exit(0);
});


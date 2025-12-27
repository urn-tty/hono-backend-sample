import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './drizzle.schema';

// 環境変数からデータベースURLを取得
declare const process: {
  env: {
    DATABASE_URL?: string;
    [key: string]: string | undefined;
  };
};

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/api_sample';

// PostgreSQL接続を作成
const client = postgres(databaseUrl);

export const db = drizzle(client, { schema });


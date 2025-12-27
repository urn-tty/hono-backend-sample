import app from "./index";

// 環境変数からポートを取得（デフォルト: 8080）
// Bunでは process.env が利用可能
declare const process: {
  env: {
    PORT?: string;
    [key: string]: string | undefined;
  };
};

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

export default {
  port,
  fetch: app.fetch,
};

console.log(`🚀 Server is running on http://localhost:${port}`);

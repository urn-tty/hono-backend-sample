import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { createUserRoutes } from './presentation/routes/user.routes';
import { userController } from './di/container';

type Env = {
  // 環境変数の型定義（必要に応じて追加）
};

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Health check
app.get('/', (c) => {
  return c.json({ message: 'Hello, Hono!', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User routes
app.route('/api/users', createUserRoutes(userController));

export default app;

// 型エクスポート（必要に応じて使用）
export type AppType = typeof app;


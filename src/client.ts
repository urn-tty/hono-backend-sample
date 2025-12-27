/**
 * サーバーサイドから同じAPIを呼び出す場合のクライアント例
 * フロントエンドでは client-example.ts を参照してください
 */

import { hc } from 'hono/client';
import type { App } from './types';

const baseURL = process.env.API_URL || 'http://localhost:3000';

export const apiClient = hc<App>(baseURL);


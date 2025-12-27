/**
 * Hono RPC クライアントの使用例
 * 
 * このファイルはフロントエンド側で使用するクライアントコードの例です。
 * 
 * 使用方法:
 * 1. バックエンドの型をインポート
 * 2. hcクライアントを作成
 * 3. 型安全なAPI呼び出しを行う
 */

import { hc } from 'hono/client';
import type { App } from './src/types';

// バックエンドのベースURL
const baseURL = 'http://localhost:3000';

// 型安全なクライアントを作成
const client = hc<App>(baseURL);

// 使用例:

// 1. Health Check
async function healthCheck() {
  const res = await client.api.health.$get();
  const data = await res.json();
  console.log('Health:', data); // { status: 'ok', timestamp: string }
}

// 2. ユーザー一覧取得
async function getUsers() {
  const res = await client.api.users.$get();
  const users = await res.json();
  console.log('Users:', users); // User[] 型が推論される
}

// 3. ユーザー取得（ID指定）
async function getUser(id: number) {
  const res = await client.api.users[':id'].$get({
    param: { id: id.toString() },
  });
  const user = await res.json();
  console.log('User:', user); // User | { error: string } 型が推論される
}

// 4. ユーザー作成
async function createUser() {
  const res = await client.api.users.$post({
    json: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  });
  const newUser = await res.json();
  console.log('Created user:', newUser); // User 型が推論される
}

// 5. ユーザー更新
async function updateUser(id: number) {
  const res = await client.api.users[':id'].$put({
    param: { id: id.toString() },
    json: {
      name: 'Jane Doe',
      // emailも更新可能（オプショナル）
    },
  });
  const updatedUser = await res.json();
  console.log('Updated user:', updatedUser);
}

// 6. ユーザー削除
async function deleteUser(id: number) {
  const res = await client.api.users[':id'].$delete({
    param: { id: id.toString() },
  });
  const result = await res.json();
  console.log('Delete result:', result);
}

// 実行例（コメントアウト）
// healthCheck();
// getUsers();
// createUser();
// updateUser(1);
// deleteUser(1);

export { client };


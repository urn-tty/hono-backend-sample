# API Sample

Hono + TypeScript + Bun + Drizzle ORM + Zod を使用したバックエンド API サーバー

DDD（ドメイン駆動設計）とクリーンアーキテクチャの原則に基づいて設計されています。

## 技術スタック

- **Runtime**: Bun
- **Framework**: Hono
- **Language**: TypeScript
- **ORM**: Drizzle ORM
- **Database**: SQLite (better-sqlite3)
- **Validation**: Zod
- **Migration**: Drizzle Kit
- **RPC**: Hono RPC (型安全な API 通信)
- **Client**: hc (Hono Client - 型安全なクライアント)
- **Architecture**: DDD (ドメイン駆動設計) + クリーンアーキテクチャ

## セットアップ

### 1. 依存関係のインストール

```bash
bun install
```

### 2. データベースマイグレーション

```bash
# マイグレーションファイルの生成
bun run db:generate

# マイグレーションの実行
bun run db:migrate
```

### 3. 開発サーバーの起動

```bash
bun run dev
```

サーバーは `http://localhost:3000` で起動します。

## ディレクトリ構造

```
.
├── src/
│   ├── domain/                    # ドメイン層（ビジネスロジック）
│   │   ├── entities/              # エンティティ
│   │   │   └── user.entity.ts
│   │   ├── repositories/          # リポジトリインターフェース
│   │   │   └── user.repository.interface.ts
│   │   └── errors/                # ドメインエラー
│   │       └── domain.error.ts
│   ├── application/               # アプリケーション層（ユースケース）
│   │   ├── use-cases/             # ユースケース
│   │   │   ├── create-user.use-case.ts
│   │   │   ├── get-user.use-case.ts
│   │   │   ├── list-users.use-case.ts
│   │   │   ├── update-user.use-case.ts
│   │   │   └── delete-user.use-case.ts
│   │   └── dto/                   # データ転送オブジェクト
│   │       └── user.dto.ts
│   ├── infrastructure/            # インフラストラクチャ層（実装詳細）
│   │   ├── database/              # データベース
│   │   │   ├── db.ts
│   │   │   ├── drizzle.schema.ts
│   │   │   └── migrate.ts
│   │   └── repositories/          # リポジトリ実装
│   │       └── user.repository.ts
│   ├── presentation/              # プレゼンテーション層（HTTP/API）
│   │   ├── controllers/           # コントローラー
│   │   │   └── user.controller.ts
│   │   ├── routes/                # ルーティング
│   │   │   └── user.routes.ts
│   │   └── mappers/               # DTOマッパー
│   │       └── user.mapper.ts
│   ├── di/                        # 依存性注入
│   │   └── container.ts
│   ├── index.ts                   # メインアプリケーション
│   ├── types.ts                   # 型定義（RPC用）
│   ├── client.ts                  # サーバーサイドクライアント
│   └── server.ts                  # サーバーエントリーポイント
├── client-example.ts              # フロントエンド用クライアント例
├── drizzle/                       # マイグレーションファイル（自動生成）
├── drizzle.config.ts              # Drizzle設定
├── tsconfig.json                  # TypeScript設定
└── package.json
```

## API エンドポイント

### Health Check

- `GET /` - 基本的なヘルスチェック
- `GET /api/health` - API ヘルスチェック

### Users

- `GET /api/users` - 全ユーザー取得
- `GET /api/users/:id` - ユーザー取得
- `POST /api/users` - ユーザー作成
- `PUT /api/users/:id` - ユーザー更新
- `DELETE /api/users/:id` - ユーザー削除

## 開発コマンド

```bash
# 開発サーバー起動
bun run dev

# マイグレーション生成
bun run db:generate

# マイグレーション実行
bun run db:migrate

# Drizzle Studio（DB管理UI）
bun run db:studio
```

## Hono RPC と hc クライアント

このプロジェクトは、Hono RPC と hc クライアントを使用したエンドツーエンドの型安全性をサポートしています。

### フロントエンドでの使用例

```typescript
import { hc } from "hono/client";
import type { App } from "./src/types";

// 型安全なクライアントを作成
const client = hc<App>("http://localhost:3000");

// 型安全なAPI呼び出し
const res = await client.api.users.$get();
const users = await res.json(); // User[] 型が推論される

// ユーザー作成
const newUser = await client.api.users.$post({
  json: {
    name: "John Doe",
    email: "john@example.com",
  },
});
const created = await newUser.json(); // User 型が推論される
```

詳細な使用例は `client-example.ts` を参照してください。

### 型安全性のメリット

- **コンパイル時型チェック**: API の変更が即座にフロントエンドの型エラーとして検出されます
- **自動補完**: IDE でエンドポイントやパラメータの自動補完が効きます
- **型推論**: レスポンスの型が自動的に推論されます
- **リファクタリング安全性**: API の変更時に型エラーで影響箇所を把握できます

## アーキテクチャ

このプロジェクトは、クリーンアーキテクチャと DDD の原則に基づいて設計されています。

### レイヤー構造

1. **Domain Layer（ドメイン層）**

   - ビジネスロジックの中核
   - エンティティ、値オブジェクト、ドメインサービス
   - 外部依存がない純粋なビジネスロジック

2. **Application Layer（アプリケーション層）**

   - ユースケースの実装
   - ビジネストランザクションの調整
   - DTO の定義

3. **Infrastructure Layer（インフラストラクチャ層）**

   - データベースアクセスの実装
   - 外部サービスとの連携
   - リポジトリの実装

4. **Presentation Layer（プレゼンテーション層）**
   - HTTP リクエスト/レスポンスの処理
   - ルーティング、コントローラー
   - DTO とエンティティの変換

### 依存関係の方向

```
Presentation → Application → Domain
                    ↓
              Infrastructure
```

- 外側の層は内側の層に依存できるが、内側の層は外側に依存しない
- ドメイン層は完全に独立している
- インターフェースを使って抽象化

## 環境変数

`.env` ファイルを作成して以下を設定できます（オプション）：

```env
PORT=3000
API_URL=http://localhost:3000
```

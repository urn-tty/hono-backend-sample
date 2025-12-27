# API Sample

Hono + TypeScript + Bun + Drizzle ORM + Zod を使用したバックエンド API サーバー

DDD（ドメイン駆動設計）とクリーンアーキテクチャの原則に基づいて設計されています。

## 技術スタック

- **Runtime**: Bun
- **Framework**: Hono
- **Language**: TypeScript
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Validation**: Zod
- **Container**: Docker & Docker Compose
- **Migration**: Drizzle Kit
- **Architecture**: DDD (ドメイン駆動設計) + クリーンアーキテクチャ

## セットアップ

### Docker Compose を使用する場合（推奨）

#### 1. 環境変数ファイルの作成

```bash
# .env.sampleをコピーして.envを作成
cp .env.sample .env

# .envファイルを編集して環境に合わせて設定
```

#### 2. 開発環境

```bash
# docker-compose.override.ymlを作成（ホットリロード対応）
cat > docker-compose.override.yml << EOF
version: "3.8"
services:
  api:
    build:
      target: development
    volumes:
      - ./src:/app/src
      - ./package.json:/app/package.json
      - ./bun.lock:/app/bun.lock
      - /app/node_modules
    command: bun run --watch src/server.ts
EOF

# .envでNODE_ENV=developmentを設定
# docker-compose.override.ymlが自動的に読み込まれます

# コンテナの起動
docker-compose up -d

# マイグレーションの実行
docker-compose exec api bun run db:migrate

# ログの確認
docker-compose logs -f api
```

#### 3. 本番環境

```bash
# .envでNODE_ENV=productionを設定
# docker-compose.override.ymlが存在しない、または削除されていることを確認

# コンテナの起動
docker-compose up -d

# マイグレーションの実行
docker-compose exec api bun run db:migrate

# ログの確認
docker-compose logs -f api
```

サーバーは `http://localhost:${PORT:-8080}` で起動します（デフォルト: 8080）。

**注意**: `docker-compose.override.yml`は開発環境でのみ使用し、本番環境では削除してください（gitignore に追加済み）。

### ローカル開発環境の場合

#### 1. 依存関係のインストール

```bash
bun install
```

#### 2. PostgreSQL の起動

```bash
# Docker ComposeでPostgreSQLのみ起動
docker-compose up -d postgres
```

または、ローカルに PostgreSQL がインストールされている場合は、直接起動してください。

#### 3. 環境変数の設定

`.env` ファイルを作成：

```bash
cp .env.sample .env
```

`.env` ファイルを編集して環境に合わせて設定します。詳細は `.env.sample` を参照してください。

#### 4. データベースマイグレーション

```bash
# マイグレーションファイルの生成
bun run db:generate

# マイグレーションの実行
bun run db:migrate
```

#### 5. 開発サーバーの起動

```bash
bun run dev
```

サーバーは `http://localhost:8080` で起動します。

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
│   └── server.ts                  # サーバーエントリーポイント
├── drizzle/                       # マイグレーションファイル（自動生成）
├── drizzle.config.ts              # Drizzle設定
├── Dockerfile                     # Dockerイメージ定義（マルチステージビルド）
├── docker-compose.yml             # Docker Compose設定
├── .dockerignore                  # Docker除外ファイル
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

### ローカル開発

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

### Docker Compose

```bash
# コンテナの起動
docker-compose up -d

# コンテナの停止
docker-compose down

# コンテナの再ビルド
docker-compose build

# ログの確認
docker-compose logs -f api

# コンテナ内でコマンド実行
docker-compose exec api bun run db:migrate
docker-compose exec api bun run db:studio
```

#### 環境の切り替え

- **開発環境**: `docker-compose.override.yml`を作成（`docker-compose.override.yml.example`をコピー）
- **本番環境**: `docker-compose.override.yml`を削除または存在しない状態にする

#### Dockerfile の使い分け

- **本番環境**: `BUILD_TARGET=production`（デフォルト）- マルチステージビルド、非 root ユーザー、最小限の依存関係
- **開発環境**: `BUILD_TARGET=development`（docker-compose.override.yml で設定）- すべての依存関係を含む

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

`.env` ファイルを作成して環境変数を設定します：

```bash
# .env.sampleをコピーして.envを作成
cp .env.sample .env

# .envファイルを編集して環境に合わせて設定
```

詳細な環境変数の説明は `.env.sample` を参照してください。

### 環境変数の優先順位

1. `.env` ファイルの値
2. 環境変数（`export` や `docker-compose` の `environment`）
3. docker-compose.yml のデフォルト値（`${VAR:-default}`）

### Docker Compose での使用

`docker-compose.yml` は自動的に `.env` ファイルを読み込みます。`.env` ファイルで環境を切り替えることができます。

### ローカル開発での使用

ローカルで開発する場合も、`.env` ファイルの環境変数が使用されます。

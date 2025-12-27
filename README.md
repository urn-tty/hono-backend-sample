# hono-backend-sample

Hono + TypeScript + Bun + Drizzle ORM を使用したバックエンド API サーバー

DDD（ドメイン駆動設計）とクリーンアーキテクチャで設計されています。

## 技術スタック

- **Runtime**: Bun
- **Framework**: Hono
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Validation**: Zod
- **Container**: Docker & Docker Compose
- **Code Quality**: Biome
- **Testing**: Bun Test

## クイックスタート

### 開発環境（デフォルト）

```bash
# コンテナの起動（開発モード）
docker compose up

# スキーマを変更した場合
docker compose exec api bun run db:generate
# → サーバーが自動的に再起動してマイグレーションを実行します
```

サーバーが `http://localhost:8080` で起動します。

**API ドキュメント**: `http://localhost:8080/api/docs`

### 本番環境

```bash
# 環境変数を設定して本番モードで起動
BUILD_TARGET=production NODE_ENV=production docker compose up -d --build

# マイグレーション実行
docker compose exec api bun run db:migrate
```

**開発環境の特徴:**
- ソースコードの変更が即座に反映（ホットリロード）
- スキーマ変更時に自動マイグレーション実行
- Dockerの再起動不要！

## ディレクトリ構造

```
src/
├── domain/          # ドメイン層
├── application/     # アプリケーション層
├── infrastructure/  # インフラ層
├── presentation/    # プレゼンテーション層
└── di/              # 依存性注入
```

詳細は `.cursor/.cursorrules` を参照してください。

## API エンドポイント

**Health Check**

- `GET /`, `GET /api/health`

**Users**

- `GET /api/users` - 一覧取得
- `GET /api/users/:id` - 取得
- `POST /api/users` - 作成
- `PUT /api/users/:id` - 更新
- `DELETE /api/users/:id` - 削除

## API ドキュメント

アプリケーション起動後、以下の URL でインタラクティブな API ドキュメントにアクセスできます：

- **Scalar UI**: `http://localhost:8080/api/docs`
- **OpenAPI JSON**: `http://localhost:8080/api/openapi.json`

Zod スキーマから自動生成されるため、常に最新の API 仕様が確認できます。

## 開発コマンド

### Docker

```bash
# 開発環境で起動（デフォルト）
docker compose up

# 本番環境で起動
BUILD_TARGET=production NODE_ENV=production docker compose up -d --build

# コンテナの停止
docker compose down

# ログ確認
docker compose logs -f api

# コンテナ内でコマンド実行
docker compose exec api <command>

# コンテナの再ビルド（依存関係変更時など）
docker compose build --no-cache
```

### データベース

#### 開発環境（推奨）

開発環境では、スキーマ変更が自動的に反映されます：

```bash
# サーバーを起動
docker compose up

# スキーマを変更したら（src/infrastructure/database/drizzle.schema.ts）
# 1. マイグレーションファイルを生成
docker compose exec api bun run db:generate

# 2. サーバーが自動的に再起動してマイグレーションを実行！
#    ※ Dockerの再起動は不要です！
```

**オプション:** スキーマファイルの変更を監視して自動でマイグレーションファイル生成

```bash
# ターミナル2で実行
docker compose exec api bun run db:generate:watch
```

#### 手動実行（本番環境など）

```bash
# マイグレーション実行
docker compose exec api bun run db:migrate

# スキーマ変更後のマイグレーションファイル生成
docker compose exec api bun run db:generate

# Drizzle Studio（DB管理UI）- 自動でブラウザが開きます
bun run db:studio:open

# または、手動でURLを開く場合
docker compose exec api bun run db:studio
# → https://local.drizzle.studio?port=4984&host=127.0.0.1 にアクセス
```

#### スキーマ変更のワークフロー

1. `src/infrastructure/database/drizzle.schema.ts` を編集
2. マイグレーションファイルを生成: `docker compose exec api bun run db:generate`
3. 開発環境では自動的にサーバーが再起動してマイグレーションが実行されます
4. 本番環境では手動で `db:migrate` を実行

### コード品質

```bash
# フォーマット・リントチェック＋自動修正
bun run check:fix

# テスト実行
bun test

# ウォッチモード
bun test:watch
```

### Git Hooks

コミット前に自動でフォーマット・リント・テストが実行されます。

## その他

- **アーキテクチャ・開発ルール**: `.cursor/.cursorrules` を参照
- **環境変数**: `.env.sample` を参考に `.env` を作成

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

```bash
# 1. 環境変数の設定
cp .env.sample .env

# 2. コンテナの起動
docker compose up -d --build

# 3. マイグレーション実行
docker compose exec api bun run db:migrate
```

サーバーが `http://localhost:8080` で起動します。

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

## 開発コマンド

### Docker

```bash
# コンテナの起動
docker compose up -d

# コンテナの停止
docker compose down

# ログ確認
docker compose logs -f api

# コンテナ内でコマンド実行
docker compose exec api <command>
```

### データベース

```bash
# マイグレーション実行
docker compose exec api bun run db:migrate

# スキーマ変更後のマイグレーションファイル生成
docker compose exec api bun run db:generate

# Drizzle Studio（DB管理UI） → https://local.drizzle.studio?port=4984&host=127.0.0.1
docker compose exec api bun run db:studio
```

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

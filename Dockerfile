# ビルドステージ
FROM oven/bun:1.3.5 AS builder

# Node.jsとnpmをインストール（drizzle-kit studio用）
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest

WORKDIR /app

# 依存関係をコピー
COPY package.json bun.lock ./

# 環境変数で本番/開発を切り替え（デフォルトは本番）
ARG NODE_ENV=production
# 本番環境ではdevDependenciesを除外、開発環境ではすべてインストール
RUN if [ "$NODE_ENV" = "production" ]; then \
      bun install --frozen-lockfile --production; \
    else \
      bun install --frozen-lockfile; \
    fi

# アプリケーションコードをコピー
COPY . .

# 本番ステージ（本番環境のみ）
FROM oven/bun:1.3.5 AS production

# Node.jsとnpmをインストール（drizzle-kit studio用）
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest

WORKDIR /app

# ビルドステージから依存関係とアプリケーションをコピー
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/drizzle ./drizzle

# ポートを公開
EXPOSE 8080

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "import('http').then(() => process.exit(0)).catch(() => process.exit(1))"

# アプリケーションを起動
CMD ["bun", "run", "src/server.ts"]

# 開発ステージ（開発環境用）
FROM builder AS development

# Node.jsとnpmはbuilderステージでインストール済み

WORKDIR /app

# ポートを公開
EXPOSE 8080

# 開発サーバーを起動（docker-compose.override.ymlで上書きされる）
CMD ["bun", "run", "--watch", "src/server.ts"]


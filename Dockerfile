# ビルドステージ
FROM oven/bun:1.3.5 AS builder

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
FROM oven/bun:1.3.5-slim AS production

WORKDIR /app

# 非rootユーザーを作成
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 bunuser

# ビルドステージから依存関係とアプリケーションをコピー
COPY --from=builder --chown=bunuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=bunuser:nodejs /app/package.json ./package.json
COPY --from=builder --chown=bunuser:nodejs /app/src ./src
COPY --from=builder --chown=bunuser:nodejs /app/drizzle.config.ts ./drizzle.config.ts

# 非rootユーザーに切り替え
USER bunuser

# ポートを公開
EXPOSE 8080

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "import('http').then(() => process.exit(0)).catch(() => process.exit(1))"

# アプリケーションを起動
CMD ["bun", "run", "src/server.ts"]

# 開発ステージ（開発環境用）
FROM builder AS development

WORKDIR /app

# ポートを公開
EXPOSE 8080

# 開発サーバーを起動（docker-compose.override.ymlで上書きされる）
CMD ["bun", "run", "--watch", "src/server.ts"]


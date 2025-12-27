#!/bin/bash

# Drizzle Studioを起動して、ブラウザで自動的に開くスクリプト

URL="https://local.drizzle.studio/?port=4984&host=127.0.0.1"

echo "🚀 Drizzle Studioを起動します..."
echo "📌 URL: $URL"
echo ""

# ポート4984が既に使用されているか確認
if lsof -Pi :4984 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  ポート4984は既に使用中です"
    echo "📖 ブラウザを開きます..."
    open "$URL"
    echo ""
    echo "✅ 既に起動しているDrizzle Studioに接続しました"
    exit 0
fi

# Drizzle Studioを起動（バックグラウンド）
echo "🔄 Drizzle Studioを起動中..."
docker compose exec api bun run db:studio &
STUDIO_PID=$!

# 起動を待つ
sleep 3

echo "📖 ブラウザを開いています..."
open "$URL"

echo ""
echo "✅ Drizzle Studioが起動しました"
echo "⚠️  停止するには: Ctrl+C を押してください"
echo ""

# Ctrl+Cを待つ
wait $STUDIO_PID


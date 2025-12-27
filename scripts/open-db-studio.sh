#!/bin/bash

# Drizzle Studioを起動して、ブラウザで自動的に開くスクリプト

URL="https://local.drizzle.studio/?port=4984&host=127.0.0.1"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Drizzle Studio を起動します"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ポート4984が既に使用されているか確認
if lsof -Pi :4984 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  ポート4984は既に使用中です"
    echo "📖 ブラウザを開きます..."
    echo ""
    open "$URL"
    echo "✅ 既に起動しているDrizzle Studioに接続しました"
    echo ""
    echo "📌 アクセスURL:"
    echo "   $URL"
    echo ""
    exit 0
fi

# Drizzle Studioを起動（バックグラウンド）
echo "🔄 Drizzle Studioを起動中..."
echo ""

# Drizzle Kitの出力を表示しつつ、正しいURLも表示
docker compose exec api bun run db:studio 2>&1 | while IFS= read -r line; do
    echo "$line"
    # "Drizzle Studio is up and running" メッセージを検出したら
    if [[ "$line" == *"Drizzle Studio is up and running"* ]]; then
        sleep 1
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ Drizzle Studio が起動しました！"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "📖 ブラウザでアクセスしてください:"
        echo "   $URL"
        echo ""
        echo "⚠️  停止するには: Ctrl+C を押してください"
        echo ""
        # ブラウザを開く
        open "$URL" &
    fi
done


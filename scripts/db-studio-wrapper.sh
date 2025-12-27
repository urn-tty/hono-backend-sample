#!/bin/sh

# Drizzle Studioの出力を加工して正しいURLを表示

npx drizzle-kit studio --port 4984 --host 0.0.0.0 2>&1 | while IFS= read -r line; do
    echo "$line"
    # "Drizzle Studio is up and running" を検出したら正しいURLを表示
    if echo "$line" | grep -q "Drizzle Studio is up and running"; then
        echo ""
        echo "✅ ブラウザでアクセス: https://local.drizzle.studio?port=4984&host=127.0.0.1"
        echo ""
    fi
done


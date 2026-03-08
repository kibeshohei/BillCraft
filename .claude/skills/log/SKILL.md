---
name: log
description: 今日の作業記録を .claude/notes/YYYY-MM-DD.md に追記・作成する
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash(date)
---

今日の作業記録を `.claude/notes/` に残してください。

追記する内容: $ARGUMENTS

## 手順

1. 今日の日付を確認する（`date +%Y-%m-%d`）
2. `.claude/notes/<today>.md` が存在するか確認する
3. **存在する場合**: ファイルを読んで、`$ARGUMENTS` の内容を適切なセクションに追記する
4. **存在しない場合**: 以下のテンプレートで新規作成する

## 新規作成テンプレート

```markdown
# YYYY-MM-DD

## やったこと

- $ARGUMENTS

## 気づき・メモ

（特記事項があれば）

## 次回やること

（続きがあれば）
```

## ルール

- 箇条書きで簡潔に記録する
- 技術的な判断や気づきは「気づき・メモ」に残す
- 次のセッションへの引き継ぎ事項は「次回やること」に書く
- 作成・追記した内容をユーザーに提示して確認を取る

---
name: lesson
description: 失敗・ハマりポイントを pitfalls.md に記録する
disable-model-invocation: true
allowed-tools: Read, Edit
---

以下の内容を `.claude/rules/pitfalls.md` に追記してください。

記録する内容: $ARGUMENTS

## 追記フォーマット

```markdown
## YYYY-MM-DD: <タイトル>

**状況**: どんな作業をしていたか
**問題**: 何が起きたか
**原因**: なぜ起きたか
**解決策**: どう解決したか
**今後**: 同じ問題を防ぐためにすること
```

## 手順

1. `.claude/rules/pitfalls.md` を読む
2. $ARGUMENTS をもとに上記フォーマットで内容を整理する
3. 不明な項目はユーザーに確認する
4. ファイルの末尾に追記する
5. 追記した内容をユーザーに提示して確認を取る

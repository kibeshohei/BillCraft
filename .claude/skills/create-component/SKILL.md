---
name: create-component
description: Next.js の React コンポーネントのひな形を生成する
disable-model-invocation: true
allowed-tools: Read, Write, Bash(ls *)
---

以下の情報をもとに Next.js コンポーネントを作成してください。

- コンポーネント名: $ARGUMENTS

## 作成前の確認事項

1. `app/components/` 以下の既存コンポーネントを確認し、類似のものがないか調べる
2. Server Component か Client Component かをユーザーに確認する
   - インタラクション（onClick, useState 等）が必要 → Client Component（`"use client"` を付ける）
   - データ取得・表示のみ → Server Component（デフォルト）

## コンポーネントのルール

- ファイル名は PascalCase（例: `InvoiceCard.tsx`）
- 配置場所は `app/components/` 以下
- Props は TypeScript の `interface` で定義する
- スタイルは TailwindCSS のみ使用する
- `any` は使わない

## Server Component のひな形

```tsx
interface Props {
  // Props をここに定義
}

export default function ComponentName({ }: Props) {
  return (
    <div>
      {/* 実装 */}
    </div>
  )
}
```

## Client Component のひな形

```tsx
"use client"

import { useState } from "react"

interface Props {
  // Props をここに定義
}

export default function ComponentName({ }: Props) {
  return (
    <div>
      {/* 実装 */}
    </div>
  )
}
```

コンポーネントの目的・表示する内容を確認したうえで実装してください。

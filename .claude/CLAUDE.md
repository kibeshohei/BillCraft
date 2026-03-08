# BillCraft

フリーランス向けの請求書作成・管理プラットフォーム。
請求先・金額・口座情報などを入力するとPDFで請求書を出力できる。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router) + TypeScript
- **スタイリング**: TailwindCSS v4
- **認証**: NextAuth.js（メールアドレス＋パスワード）
- **DB**: MongoDB（MVP） → Prisma + PostgreSQL on AWS（スケール後）
- **PDF出力**: @react-pdf/renderer
- **デプロイ**: Vercel（MVP） → AWS（スケール後）

## 開発コマンド

```bash
npm run dev    # 開発サーバー起動
npm run build  # ビルド
npm run lint   # ESLintチェック
```

## アーキテクチャ方針

- **App Router** を使用する。Pages Router は使わない。
- **Server Components** を基本とし、インタラクションが必要な箇所のみ `"use client"` を付ける。
- **Server Actions** でデータの取得・更新を行う。APIルートは外部連携が必要な場合のみ使う。
- 認証セッションは NextAuth.js の `auth()` で取得する。

## ディレクトリ構成

```
app/
├── (auth)/          # 認証関連ページ（ログイン・登録）
├── (dashboard)/     # ログイン後のページ群
│   ├── invoices/    # 請求書一覧・詳細・作成
│   └── settings/    # アカウント設定・口座情報
├── api/             # 外部連携が必要なAPIルートのみ
├── components/      # 共通コンポーネント
└── lib/             # ユーティリティ・DB接続・型定義
```

## コーディング規約

- TypeScript の `strict` モードを有効にする。`any` は使わない。
- コンポーネントファイルは PascalCase（例: `InvoiceCard.tsx`）。
- ユーティリティ・関数ファイルは camelCase（例: `formatCurrency.ts`）。
- TailwindCSS でスタイリングする。CSS Modules や styled-components は使わない。
- `console.log` はデバッグ用途のみ。コミット前に削除する。

## フェーズ管理

| フェーズ | DB | デプロイ | 状態 |
|---|---|---|---|
| MVP | MongoDB | Vercel | 現在 |
| スケール | Prisma + PostgreSQL | AWS | 未定 |

DB移行時はスキーマ設計を変えずに移行できるよう、ドメインモデルを意識して設計する。

## 失敗・ハマりポイントの管理

作業中に以下のような状況が発生したら、**必ず** `.claude/rules/pitfalls.md` を更新すること。

- 実装してみたら動かなかった
- ライブラリの使い方を間違えた
- 想定外のエラーが発生した
- 同じ問題を2回以上踏んだ

`/lesson` コマンドでも手動で記録できる。

## 未確定事項

- PDF出力のレイアウト・デザイン詳細
- 請求書のステータス管理（下書き・送付済み・入金済み等）
- メール送信機能（請求書をメールで送る）

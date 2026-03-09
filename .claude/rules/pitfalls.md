# Pitfalls（失敗・ハマりポイントの記録）

このファイルには過去に発生した問題・ハマりポイントを記録する。
新しい問題が発生したら必ずここに追記すること。

---

<!-- 例（実際に問題が起きたら以下の形式で追記する）

## YYYY-MM-DD: タイトル

**状況**: どんな作業をしていたか
**問題**: 何が起きたか
**原因**: なぜ起きたか
**解決策**: どう解決したか
**今後**: 同じ問題を防ぐためにすること

-->

## 2026-03-08: Node.js バージョン不足でビルド失敗

**状況**: Next.js 16 プロジェクトで npm run build を実行
**問題**: Node.js v18 を使っており、ビルドが即時終了
**原因**: Next.js 16 は Node.js >= 20.9.0 を要求する。Node 18 でインストールしたネイティブモジュール（@tailwindcss/oxide）が Node 20 切り替え後に動かなくなった
**解決策**: nvm で Node 20 をインストールし、node_modules を削除して npm install をやり直す
**今後**: プロジェクト開始時に Node バージョンを確認する。.nvmrc に `20` を書いておくと良い

## 2026-03-08: Client Component 内に "use server" を書いてはいけない

**状況**: ログインページ（Client Component）に Server Action をインライン定義
**問題**: ビルドエラー「It is not allowed to define inline "use server" annotated Server Actions in Client Components」
**原因**: Next.js App Router の制約。Client Component 内では "use server" ディレクティブを使えない
**解決策**: Server Action を別ファイル（actions.ts）に切り出し、import して使う
**今後**: Client Component で Server Action が必要な場合は必ず別ファイルに分離する

## 2026-03-08: useSearchParams() は Suspense でラップが必要

**状況**: ログインページで useSearchParams() を使って ?registered=true を読み取ろうとした
**問題**: ビルド時エラー「useSearchParams() should be wrapped in a suspense boundary」
**原因**: useSearchParams() は静的レンダリング時にクライアントサイドの情報を必要とするため、Suspense が必須
**解決策**: useSearchParams() を使うコンポーネントを切り出し、親で `<Suspense>` でラップする
**今後**: useSearchParams / usePathname など動的フックを使うコンポーネントは必ず Suspense でラップする

## 2026-03-08: Zod v4 で .errors が .issues に変更

**状況**: ZodError からエラーメッセージを取得しようとした
**問題**: TypeScript エラー「Property 'errors' does not exist on type 'ZodError'」
**原因**: Zod v4 で API が変更され、`.errors` が `.issues` に名称変更された
**解決策**: `parsed.error.errors[0].message` → `parsed.error.issues[0].message` に変更
**今後**: Zod のエラー取得は `.issues` を使う

## 2026-03-09: NextAuth v5 で session.user.id が undefined になる

**状況**: 請求書保存 Server Action で session.user.id を MongoDB の userId に設定
**問題**: `Invoice validation failed: userId: Path 'userId' is required.`
**原因**: NextAuth v5 は authorize() で返した id を自動的に JWT/session に含めない。callbacks で明示的に引き渡す必要がある
**解決策**: auth.ts に callbacks を追加し、jwt で token.id を設定、session で session.user.id に代入する
**今後**: NextAuth でユーザー ID をセッションから使う場合は必ず callbacks を設定する。また修正後は再ログインが必要（古いトークンには id が入っていないため）

## 2026-03-09: @react-pdf/renderer で日本語が文字化けする

**状況**: PDF に日本語テキストを出力しようとした
**問題**: デフォルトフォント（Helvetica）は日本語非対応のため文字化け
**原因**: @react-pdf/renderer は日本語フォントを内蔵していない
**解決策**: Noto Sans JP の TTF ファイルを `public/fonts/` に配置し、`Font.register()` で登録後に `fontFamily: "NotoSansJP"` を指定する
**今後**: 日本語 PDF を出力する場合は必ず日本語フォントを登録する

## 2026-03-09: redirect() を try/catch 内で使うと catch に引っかかる

**状況**: 請求書保存 Server Action で DB 保存後に redirect() を呼んだ
**問題**: 「請求書の保存に失敗しました」エラーになり保存できない
**原因**: Next.js の redirect() は内部的に NEXT_REDIRECT エラーを throw する仕組みのため、try/catch に捕捉されてしまう
**解決策**: redirect() を try/catch の外に出す。保存した ID を変数に受け取り、catch の外で redirect する
**今後**: Server Action で redirect() は必ず try/catch の外で呼ぶ

## 2026-03-09: MongoDBドキュメントをClient Componentに渡すとエラー

**状況**: 請求書編集ページ（Server Component）でDBから取得したデータをClient Componentに渡そうとした
**問題**: `Only plain objects can be passed to Client Components from Server Components` エラー
**原因**: MongoDBの`.lean()`で取得したドキュメントは、Mongoose Document オブジェクトで、toJSONメソッドを持つためそのままではClient Componentに渡せない
**解決策**: `JSON.parse(JSON.stringify(invoice))` でPlain Objectに変換してから渡す
**今後**: Server ComponentからClient Componentにデータを渡す場合は、必ずPlain Objectに変換する

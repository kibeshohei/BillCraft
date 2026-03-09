"use client"

import { Suspense } from "react"
import { useActionState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { login, type LoginState } from "./actions"

function LoginForm() {
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const [state, action, isPending] = useActionState<LoginState, FormData>(login, {})

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">ログイン</h1>
      <p className="mb-6 text-sm text-gray-500">BillCraft にログインする</p>

      {registered && (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
          登録が完了しました。ログインしてください。
        </p>
      )}

      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="taro@example.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="パスワード"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        アカウントをお持ちでない方は{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          新規登録
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Suspense fallback={<div className="text-sm text-gray-400">読み込み中...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

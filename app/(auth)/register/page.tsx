"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { register } from "./actions"

export default function RegisterPage() {
  const router = useRouter()
  const [state, action, isPending] = useActionState(register, {})

  useEffect(() => {
    if (state.success) {
      router.push("/login?registered=true")
    }
  }, [state.success, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">アカウント登録</h1>
        <p className="mb-6 text-sm text-gray-500">BillCraft へようこそ</p>

        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              お名前
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="山田 太郎"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

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
              placeholder="8文字以上"
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
            {isPending ? "登録中..." : "登録する"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  )
}

import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">BillCraft</h1>
        <p className="mb-8 text-gray-500">フリーランス向け請求書管理プラットフォーム</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            新規登録
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            ログイン
          </Link>
        </div>
      </div>
    </div>
  )
}

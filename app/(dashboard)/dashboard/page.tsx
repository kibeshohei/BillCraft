import Link from "next/link"

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-gray-900">ダッシュボード</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">請求書</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">0</p>
          <Link
            href="/invoices"
            className="mt-3 inline-block text-sm text-blue-600 hover:underline"
          >
            一覧を見る →
          </Link>
        </div>
      </div>
    </div>
  )
}

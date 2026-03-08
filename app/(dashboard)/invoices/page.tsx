import Link from "next/link"

export default function InvoicesPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">請求書</h1>
        <Link
          href="/invoices/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + 新規作成
        </Link>
      </div>

      {/* 空の状態 */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
        <p className="text-gray-400">まだ請求書がありません</p>
        <Link
          href="/invoices/new"
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          最初の請求書を作成する
        </Link>
      </div>
    </div>
  )
}

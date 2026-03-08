import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドバー */}
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-white">
        <div className="flex h-14 items-center border-b border-gray-200 px-4">
          <span className="text-base font-bold text-gray-900">BillCraft</span>
        </div>
        <nav className="p-3 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            ホーム
          </Link>
          <Link
            href="/invoices"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            請求書
          </Link>
        </nav>
      </aside>

      {/* メインコンテンツ */}
      <div className="flex flex-1 flex-col">
        {/* ヘッダー */}
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{session.user?.name}</span>
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/" })
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                ログアウト
              </button>
            </form>
          </div>
        </header>

        {/* ページコンテンツ */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

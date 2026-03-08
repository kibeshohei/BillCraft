import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mb-8 text-gray-500">ようこそ、{session.user?.name} さん</p>
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <button
            type="submit"
            className="rounded-lg bg-red-500 px-6 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            ログアウト
          </button>
        </form>
      </div>
    </div>
  )
}

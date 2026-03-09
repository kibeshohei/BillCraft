"use server"

import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { connectDB } from "@/app/lib/db"
import Invoice from "@/app/lib/models/Invoice"

export async function deleteInvoice(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "ログインが必要です" }

  try {
    await connectDB()
    await Invoice.deleteOne({
      _id: id,
      userId: (session.user as { id: string }).id,
    })
  } catch {
    return { error: "削除に失敗しました" }
  }

  redirect("/invoices")
}

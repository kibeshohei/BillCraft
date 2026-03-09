import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { connectDB } from "@/app/lib/db"
import Invoice, { type ILineItem } from "@/app/lib/models/Invoice"

export default async function InvoicesPage() {
  const session = await auth()
  if (!session) redirect("/login")

  await connectDB()
  const invoices = await Invoice.find({ userId: (session.user as { id: string }).id })
    .sort({ createdAt: -1 })
    .lean()

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

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <p className="text-gray-400">まだ請求書がありません</p>
          <Link
            href="/invoices/new"
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            最初の請求書を作成する
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  請求書番号
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  請求先
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  発行日
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  支払期限
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  金額
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((invoice) => {
                const subtotal = invoice.lineItems.reduce(
                  (sum: number, item: ILineItem) => sum + item.quantity * item.unitPrice,
                  0
                )
                const tax = Math.floor(subtotal * (invoice.taxRate / 100))
                const total = subtotal + tax

                return (
                  <tr key={invoice._id.toString()} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/invoices/${invoice._id.toString()}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{invoice.clientName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(invoice.issueDate).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(invoice.dueDate).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      ¥{total.toLocaleString("ja-JP")}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

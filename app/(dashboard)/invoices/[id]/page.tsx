import { auth } from "@/auth"
import { connectDB } from "@/app/lib/db"
import Invoice from "@/app/lib/models/Invoice"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { DeleteButton } from "./DeleteButton"

function formatCurrency(amount: number) {
  return `¥${amount.toLocaleString("ja-JP")}`
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("ja-JP")
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { id } = await params

  await connectDB()
  const invoice = await Invoice.findOne({
    _id: id,
    userId: (session.user as { id: string }).id,
  }).lean()

  if (!invoice) notFound()

  const subtotal = invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
  const tax = Math.floor(subtotal * (invoice.taxRate / 100))
  const total = subtotal + tax

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          請求書 #{invoice.invoiceNumber}
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/invoices"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← 一覧に戻る
          </Link>
          <Link
            href={`/invoices/${id}/edit`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            編集
          </Link>
          <a
            href={`/api/invoices/${id}/pdf`}
            target="_blank"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            PDFをダウンロード
          </a>
          <DeleteButton id={id} />
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        {/* 基本情報 */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500">発行日</p>
            <p className="mt-1 font-medium text-gray-900">{formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">支払期限</p>
            <p className="mt-1 font-medium text-gray-900">{formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* 請求先・請求元 */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="mb-1 text-xs font-semibold text-gray-500 uppercase">請求先</p>
            <p className="font-medium text-gray-900">{invoice.clientName}</p>
            {invoice.clientPersonName && <p className="text-gray-700">{invoice.clientPersonName}</p>}
            {invoice.clientAddress && <p className="text-gray-700">{invoice.clientAddress}</p>}
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-gray-500 uppercase">請求元</p>
            <p className="font-medium text-gray-900">{invoice.senderName}</p>
            {invoice.senderAddress && <p className="text-gray-700">{invoice.senderAddress}</p>}
            {invoice.senderContact && <p className="text-gray-700">{invoice.senderContact}</p>}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* 明細 */}
        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                <th className="pb-2 font-medium">品目</th>
                <th className="pb-2 text-right font-medium">数量</th>
                <th className="pb-2 text-right font-medium">単価</th>
                <th className="pb-2 text-right font-medium">金額</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-2 text-right">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex flex-col items-end gap-1 text-sm">
            <div className="flex w-44 justify-between">
              <span className="text-gray-700">小計</span>
              <span className="text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex w-44 justify-between">
              <span className="text-gray-700">消費税（{invoice.taxRate}%）</span>
              <span className="text-gray-900">{formatCurrency(tax)}</span>
            </div>
            <div className="flex w-44 justify-between border-t border-gray-200 pt-2 font-bold">
              <span className="text-gray-900">合計</span>
              <span className="text-lg text-gray-900">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* 振込先 */}
        {invoice.bankName && (
          <>
            <hr className="border-gray-100" />
            <div className="text-sm">
              <p className="mb-2 text-xs font-semibold text-gray-500 uppercase">振込先</p>
              <p className="text-gray-900">{invoice.bankName} {invoice.branchName} {invoice.accountType} {invoice.accountNumber}</p>
              {invoice.accountHolder && <p className="text-gray-700">{invoice.accountHolder}</p>}
            </div>
          </>
        )}

        {/* 備考 */}
        {invoice.notes && (
          <>
            <hr className="border-gray-100" />
            <div className="text-sm">
              <p className="mb-2 text-xs font-semibold text-gray-500 uppercase">備考</p>
              <p className="text-gray-700">{invoice.notes}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

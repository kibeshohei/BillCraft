"use client"

import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createInvoice, type InvoiceFormState } from "./actions"

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
      {children}
    </h2>
  )
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [state, action, isPending] = useActionState<InvoiceFormState, FormData>(createInvoice, {})
  const [lineItems, setLineItems] = useState([{ id: 1 }])

  const addLineItem = () => setLineItems((prev) => [...prev, { id: Date.now() }])
  const removeLineItem = (id: number) =>
    setLineItems((prev) => prev.filter((item) => item.id !== id))

  // 今日の日付をデフォルト値に
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">請求書を作成</h1>
        <Link href="/invoices" className="text-sm text-gray-500 hover:text-gray-700">
          ← 一覧に戻る
        </Link>
      </div>

      <form action={action} className="space-y-6">
        {/* 基本情報 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionTitle>基本情報</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="請求書番号" name="invoiceNumber" required placeholder="INV-001" />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                発行日<span className="ml-1 text-red-500">*</span>
              </label>
              <input
                name="issueDate"
                type="date"
                required
                defaultValue={today}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                支払期限<span className="ml-1 text-red-500">*</span>
              </label>
              <input
                name="dueDate"
                type="date"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 請求先 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionTitle>請求先</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="会社名 / 氏名" name="clientName" required placeholder="株式会社○○" />
            <Field label="担当者名" name="clientPersonName" placeholder="山田 太郎 様" />
            <div className="sm:col-span-2">
              <Field label="住所" name="clientAddress" placeholder="東京都渋谷区..." />
            </div>
          </div>
        </div>

        {/* 請求元 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionTitle>請求元</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="氏名 / 屋号" name="senderName" required placeholder="山田 太郎" />
            <Field label="連絡先" name="senderContact" placeholder="example@email.com" />
            <div className="sm:col-span-2">
              <Field label="住所" name="senderAddress" placeholder="東京都新宿区..." />
            </div>
          </div>
        </div>

        {/* 明細 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionTitle>明細</SectionTitle>
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500">
              <div className="col-span-6">品目</div>
              <div className="col-span-2 text-right">数量</div>
              <div className="col-span-3 text-right">単価（円）</div>
              <div className="col-span-1" />
            </div>
            {lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2">
                <div className="col-span-6">
                  <input
                    name="lineItem.name"
                    type="text"
                    required
                    placeholder={`品目 ${index + 1}`}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    name="lineItem.quantity"
                    type="number"
                    required
                    min="1"
                    defaultValue="1"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    name="lineItem.unitPrice"
                    type="number"
                    required
                    min="0"
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
                  />
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  {lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addLineItem}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            + 明細を追加
          </button>

          <div className="mt-4 flex justify-end">
            <div className="w-48 space-y-1 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>消費税率</span>
                <div className="flex items-center gap-1">
                  <input
                    name="taxRate"
                    type="number"
                    defaultValue="10"
                    min="0"
                    max="100"
                    className="w-14 rounded border border-gray-300 px-2 py-1 text-right text-sm"
                  />
                  <span>%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 振込先 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionTitle>振込先口座</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="銀行名" name="bankName" placeholder="○○銀行" />
            <Field label="支店名" name="branchName" placeholder="渋谷支店" />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">口座種別</label>
              <select
                name="accountType"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                <option value="普通">普通</option>
                <option value="当座">当座</option>
              </select>
            </div>
            <Field label="口座番号" name="accountNumber" placeholder="1234567" />
            <div className="sm:col-span-2">
              <Field label="口座名義" name="accountHolder" placeholder="ヤマダ タロウ" />
            </div>
          </div>
        </div>

        {/* 備考 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionTitle>備考</SectionTitle>
          <textarea
            name="notes"
            rows={3}
            placeholder="お振込の際は手数料をご負担ください。"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/invoices"
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "保存中..." : "請求書を保存"}
          </button>
        </div>
      </form>
    </div>
  )
}

"use client"

import { useActionState, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateInvoice, type InvoiceFormState } from "./actions"

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
  value,
  onChange,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (v: string) => void
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}

type LineItem = { id: number; name: string; quantity: string; unitPrice: string }

type FormData = {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  clientName: string
  clientPersonName: string
  clientAddress: string
  senderName: string
  senderContact: string
  senderAddress: string
  bankName: string
  branchName: string
  accountType: string
  accountNumber: string
  accountHolder: string
  notes: string
  taxRate: string
}

interface Props {
  invoice: {
    _id: string
    invoiceNumber: string
    issueDate: string
    dueDate: string
    clientName: string
    clientPersonName?: string
    clientAddress?: string
    senderName: string
    senderContact?: string
    senderAddress?: string
    bankName?: string
    branchName?: string
    accountType?: string
    accountNumber?: string
    accountHolder?: string
    notes?: string
    taxRate: number
    lineItems: { name: string; quantity: number; unitPrice: number }[]
  }
}

export function EditInvoiceForm({ invoice }: Props) {
  const router = useRouter()
  const [state, action, isPending] = useActionState<InvoiceFormState, FormData>(
    updateInvoice.bind(null, invoice._id),
    {}
  )

  const [form, setForm] = useState<FormData>({
    invoiceNumber: invoice.invoiceNumber,
    issueDate: new Date(invoice.issueDate).toISOString().split("T")[0],
    dueDate: new Date(invoice.dueDate).toISOString().split("T")[0],
    clientName: invoice.clientName,
    clientPersonName: invoice.clientPersonName || "",
    clientAddress: invoice.clientAddress || "",
    senderName: invoice.senderName,
    senderContact: invoice.senderContact || "",
    senderAddress: invoice.senderAddress || "",
    bankName: invoice.bankName || "",
    branchName: invoice.branchName || "",
    accountType: invoice.accountType || "",
    accountNumber: invoice.accountNumber || "",
    accountHolder: invoice.accountHolder || "",
    notes: invoice.notes || "",
    taxRate: String(invoice.taxRate),
  })

  const [lineItems, setLineItems] = useState<LineItem[]>(
    invoice.lineItems.map((item, i) => ({
      id: i,
      name: item.name,
      quantity: String(item.quantity),
      unitPrice: String(item.unitPrice),
    }))
  )

  useEffect(() => {
    if (state.success) {
      router.push(`/invoices/${invoice._id}`)
    }
  }, [state.success, router, invoice._id])

  const set = (key: keyof FormData) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }))

  const addLineItem = () =>
    setLineItems((prev) => [...prev, { id: Date.now(), name: "", quantity: "1", unitPrice: "" }])

  const removeLineItem = (id: number) =>
    setLineItems((prev) => prev.filter((item) => item.id !== id))

  const updateLineItem = (id: number, field: keyof Omit<LineItem, "id">, value: string) =>
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">請求書を編集</h1>
        <Link href={`/invoices/${invoice._id}`} className="text-sm text-gray-500 hover:text-gray-700">
          ← 詳細に戻る
        </Link>
      </div>

      <form action={action} className="space-y-6">
        {/* 基本情報 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionTitle>基本情報</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field
              label="請求書番号"
              name="invoiceNumber"
              required
              placeholder="INV-001"
              value={form.invoiceNumber}
              onChange={set("invoiceNumber")}
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                発行日<span className="ml-1 text-red-500">*</span>
              </label>
              <input
                name="issueDate"
                type="date"
                required
                value={form.issueDate}
                onChange={(e) => set("issueDate")(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                value={form.dueDate}
                onChange={(e) => set("dueDate")(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 請求先 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionTitle>請求先</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="会社名 / 氏名"
              name="clientName"
              required
              placeholder="株式会社○○"
              value={form.clientName}
              onChange={set("clientName")}
            />
            <Field
              label="担当者名"
              name="clientPersonName"
              placeholder="山田 太郎 様"
              value={form.clientPersonName}
              onChange={set("clientPersonName")}
            />
            <div className="sm:col-span-2">
              <Field
                label="住所"
                name="clientAddress"
                placeholder="東京都渋谷区..."
                value={form.clientAddress}
                onChange={set("clientAddress")}
              />
            </div>
          </div>
        </div>

        {/* 請求元 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionTitle>請求元</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="氏名 / 屋号"
              name="senderName"
              required
              placeholder="山田 太郎"
              value={form.senderName}
              onChange={set("senderName")}
            />
            <Field
              label="連絡先"
              name="senderContact"
              placeholder="example@email.com"
              value={form.senderContact}
              onChange={set("senderContact")}
            />
            <div className="sm:col-span-2">
              <Field
                label="住所"
                name="senderAddress"
                placeholder="東京都新宿区..."
                value={form.senderAddress}
                onChange={set("senderAddress")}
              />
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
                    value={item.name}
                    onChange={(e) => updateLineItem(item.id, "name", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    name="lineItem.quantity"
                    type="number"
                    required
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, "quantity", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    name="lineItem.unitPrice"
                    type="number"
                    required
                    min="0"
                    placeholder="0"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, "unitPrice", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
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
                    min="0"
                    max="100"
                    value={form.taxRate}
                    onChange={(e) => set("taxRate")(e.target.value)}
                    className="w-14 rounded border border-gray-300 px-2 py-1 text-right text-sm text-gray-900"
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
            <Field
              label="銀行名"
              name="bankName"
              placeholder="○○銀行"
              value={form.bankName}
              onChange={set("bankName")}
            />
            <Field
              label="支店名"
              name="branchName"
              placeholder="渋谷支店"
              value={form.branchName}
              onChange={set("branchName")}
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">口座種別</label>
              <select
                name="accountType"
                value={form.accountType}
                onChange={(e) => set("accountType")(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                <option value="普通">普通</option>
                <option value="当座">当座</option>
              </select>
            </div>
            <Field
              label="口座番号"
              name="accountNumber"
              placeholder="1234567"
              value={form.accountNumber}
              onChange={set("accountNumber")}
            />
            <div className="sm:col-span-2">
              <Field
                label="口座名義"
                name="accountHolder"
                placeholder="ヤマダ タロウ"
                value={form.accountHolder}
                onChange={set("accountHolder")}
              />
            </div>
          </div>
        </div>

        {/* 備考 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionTitle>備考</SectionTitle>
          <textarea
            name="notes"
            rows={3}
            placeholder="お振込する際は手数料をご負担ください。"
            value={form.notes}
            onChange={(e) => set("notes")(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href={`/invoices/${invoice._id}`}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "保存中..." : "変更を保存"}
          </button>
        </div>
      </form>
    </div>
  )
}

"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { connectDB } from "@/app/lib/db"
import Invoice from "@/app/lib/models/Invoice"

const LineItemSchema = z.object({
  name: z.string().min(1, "品目名を入力してください"),
  quantity: z.coerce.number().min(1, "数量は1以上で入力してください"),
  unitPrice: z.coerce.number().min(0, "単価は0以上で入力してください"),
})

const InvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "請求書番号を入力してください"),
  issueDate: z.string().min(1, "発行日を入力してください"),
  dueDate: z.string().min(1, "支払期限を入力してください"),
  clientName: z.string().min(1, "請求先名を入力してください"),
  clientPersonName: z.string().optional(),
  clientAddress: z.string().optional(),
  senderName: z.string().min(1, "請求元名を入力してください"),
  senderAddress: z.string().optional(),
  senderContact: z.string().optional(),
  lineItems: z.array(LineItemSchema).min(1, "明細を1件以上入力してください"),
  bankName: z.string().optional(),
  branchName: z.string().optional(),
  accountType: z.string().optional(),
  accountNumber: z.string().optional(),
  accountHolder: z.string().optional(),
  notes: z.string().optional(),
  taxRate: z.coerce.number().default(10),
})

export type InvoiceFormState = {
  error?: string
}

export async function createInvoice(
  _prev: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState> {
  const session = await auth()
  if (!session?.user) return { error: "ログインが必要です" }

  // 明細を配列で取り出す
  const lineItemNames = formData.getAll("lineItem.name")
  const lineItemQuantities = formData.getAll("lineItem.quantity")
  const lineItemUnitPrices = formData.getAll("lineItem.unitPrice")

  const lineItems = lineItemNames.map((name, i) => ({
    name,
    quantity: lineItemQuantities[i],
    unitPrice: lineItemUnitPrices[i],
  }))

  const parsed = InvoiceSchema.safeParse({
    invoiceNumber: formData.get("invoiceNumber"),
    issueDate: formData.get("issueDate"),
    dueDate: formData.get("dueDate"),
    clientName: formData.get("clientName"),
    clientPersonName: formData.get("clientPersonName") || undefined,
    clientAddress: formData.get("clientAddress") || undefined,
    senderName: formData.get("senderName"),
    senderAddress: formData.get("senderAddress") || undefined,
    senderContact: formData.get("senderContact") || undefined,
    lineItems,
    bankName: formData.get("bankName") || undefined,
    branchName: formData.get("branchName") || undefined,
    accountType: formData.get("accountType") || undefined,
    accountNumber: formData.get("accountNumber") || undefined,
    accountHolder: formData.get("accountHolder") || undefined,
    notes: formData.get("notes") || undefined,
    taxRate: formData.get("taxRate") || 10,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    await connectDB()
    const invoice = await Invoice.create({
      ...parsed.data,
      userId: (session.user as { id: string }).id,
      issueDate: new Date(parsed.data.issueDate),
      dueDate: new Date(parsed.data.dueDate),
    })
    redirect(`/invoices/${invoice._id}`)
  } catch {
    return { error: "請求書の保存に失敗しました" }
  }
}

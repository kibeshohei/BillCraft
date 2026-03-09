import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { connectDB } from "@/app/lib/db"
import Invoice from "@/app/lib/models/Invoice"
import { EditInvoiceForm } from "./EditInvoiceForm"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditInvoicePage({ params }: Props) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params

  await connectDB()
  const invoice = await Invoice.findOne({
    _id: id,
    userId: (session.user as { id: string }).id,
  }).lean()

  if (!invoice) {
    notFound()
  }

  // MongoDBのドキュメントをPlain Objectに変換
  const plainInvoice = JSON.parse(JSON.stringify(invoice))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <EditInvoiceForm invoice={plainInvoice as any} />
}

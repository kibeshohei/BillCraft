import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer"
import type { ReactElement, JSXElementConstructor } from "react"
import { auth } from "@/auth"
import { connectDB } from "@/app/lib/db"
import Invoice from "@/app/lib/models/Invoice"
import InvoiceDocument from "@/app/lib/pdf/InvoiceDocument"
import React from "react"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  await connectDB()
  const invoice = await Invoice.findOne({
    _id: id,
    userId: (session.user as { id: string }).id,
  }).lean()

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const buffer = await renderToBuffer(
    React.createElement(InvoiceDocument, { invoice }) as ReactElement<DocumentProps, string | JSXElementConstructor<unknown>>
  )

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
    },
  })
}

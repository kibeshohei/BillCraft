import mongoose, { Schema, model, Model } from "mongoose"

export interface ILineItem {
  name: string
  quantity: number
  unitPrice: number
}

export interface IInvoice {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId

  // 請求書番号・日付
  invoiceNumber: string
  issueDate: Date
  dueDate: Date

  // 請求先
  clientName: string
  clientPersonName?: string
  clientAddress?: string

  // 請求元
  senderName: string
  senderAddress?: string
  senderContact?: string

  // 明細
  lineItems: ILineItem[]

  // 振込先
  bankName?: string
  branchName?: string
  accountType?: string
  accountNumber?: string
  accountHolder?: string

  // その他
  notes?: string
  taxRate: number

  createdAt: Date
  updatedAt: Date
}

const LineItemSchema = new Schema<ILineItem>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
})

const InvoiceSchema = new Schema<IInvoice>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    invoiceNumber: { type: String, required: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    clientName: { type: String, required: true, trim: true },
    clientPersonName: { type: String, trim: true },
    clientAddress: { type: String, trim: true },
    senderName: { type: String, required: true, trim: true },
    senderAddress: { type: String, trim: true },
    senderContact: { type: String, trim: true },
    lineItems: { type: [LineItemSchema], required: true },
    bankName: { type: String, trim: true },
    branchName: { type: String, trim: true },
    accountType: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    accountHolder: { type: String, trim: true },
    notes: { type: String, trim: true },
    taxRate: { type: Number, default: 10 },
  },
  { timestamps: true }
)

const Invoice: Model<IInvoice> =
  (mongoose.models?.["Invoice"] as Model<IInvoice>) ?? model<IInvoice>("Invoice", InvoiceSchema)

export default Invoice

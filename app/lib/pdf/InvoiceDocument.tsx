import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer"
import type { IInvoice } from "@/app/lib/models/Invoice"

// 日本語フォントは未登録のためシステムフォントにフォールバック
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  box: {
    width: "47%",
  },
  label: {
    fontSize: 8,
    color: "#888",
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 10,
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    marginBottom: 12,
  },
  // 明細テーブル
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: "6 8",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    padding: "6 8",
  },
  colName: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 2, textAlign: "right" },
  colAmount: { flex: 2, textAlign: "right" },
  // 合計
  totals: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 180,
    marginBottom: 3,
  },
  totalLabel: { flex: 1, fontSize: 9, color: "#888" },
  totalValue: { width: 80, textAlign: "right", fontSize: 9 },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 180,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 4,
    marginTop: 2,
  },
  grandTotalLabel: { flex: 1, fontFamily: "Helvetica-Bold", fontSize: 10 },
  grandTotalValue: {
    width: 80,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  // 振込先・備考
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 3,
  },
})

function formatCurrency(amount: number) {
  return `¥${amount.toLocaleString("ja-JP")}`
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

interface Props {
  invoice: IInvoice
}

export default function InvoiceDocument({ invoice }: Props) {
  const subtotal = invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
  const tax = Math.floor(subtotal * (invoice.taxRate / 100))
  const total = subtotal + tax

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Invoice</Text>

        {/* 請求番号・日付 */}
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.label}>Invoice No.</Text>
            <Text style={styles.value}>{invoice.invoiceNumber}</Text>
            <Text style={styles.label}>Issue Date</Text>
            <Text style={styles.value}>{formatDate(invoice.issueDate)}</Text>
            <Text style={styles.label}>Due Date</Text>
            <Text style={styles.value}>{formatDate(invoice.dueDate)}</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.value}>{invoice.senderName}</Text>
            {invoice.senderAddress && (
              <Text style={styles.value}>{invoice.senderAddress}</Text>
            )}
            {invoice.senderContact && (
              <Text style={styles.value}>{invoice.senderContact}</Text>
            )}
          </View>
        </View>

        {/* 請求先 */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.label}>Bill To</Text>
          <Text style={styles.value}>{invoice.clientName}</Text>
          {invoice.clientPersonName && (
            <Text style={styles.value}>{invoice.clientPersonName}</Text>
          )}
          {invoice.clientAddress && (
            <Text style={styles.value}>{invoice.clientAddress}</Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* 明細テーブル */}
        <View style={styles.tableHeader}>
          <Text style={styles.colName}>Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colPrice}>Unit Price</Text>
          <Text style={styles.colAmount}>Amount</Text>
        </View>
        {invoice.lineItems.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.colName}>{item.name}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>{formatCurrency(item.unitPrice)}</Text>
            <Text style={styles.colAmount}>
              {formatCurrency(item.quantity * item.unitPrice)}
            </Text>
          </View>
        ))}

        {/* 合計 */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%)</Text>
            <Text style={styles.totalValue}>{formatCurrency(tax)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* 振込先 */}
        {invoice.bankName && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bank Account</Text>
            <Text style={styles.value}>
              {invoice.bankName}
              {invoice.branchName ? ` ${invoice.branchName}` : ""}
              {invoice.accountType ? ` ${invoice.accountType}` : ""}
              {invoice.accountNumber ? ` ${invoice.accountNumber}` : ""}
            </Text>
            {invoice.accountHolder && (
              <Text style={styles.value}>{invoice.accountHolder}</Text>
            )}
          </View>
        )}

        {/* 備考 */}
        {invoice.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.value}>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}

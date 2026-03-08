import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer"
import path from "path"
import type { IInvoice } from "@/app/lib/models/Invoice"

Font.register({
  family: "NotoSansJP",
  fonts: [
    {
      src: path.join(process.cwd(), "public/fonts/NotoSansJP-Regular.ttf"),
      fontWeight: 400,
    },
    {
      src: path.join(process.cwd(), "public/fonts/NotoSansJP-Regular.ttf"),
      fontWeight: 700,
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "NotoSansJP",
    color: "#1a1a1a",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
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
    fontWeight: 700,
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
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: "6 8",
    fontWeight: 700,
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
  grandTotalLabel: { flex: 1, fontWeight: 700, fontSize: 10 },
  grandTotalValue: {
    width: 80,
    textAlign: "right",
    fontWeight: 700,
    fontSize: 12,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: "#888",
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
        <Text style={styles.title}>請求書</Text>

        {/* 請求番号・日付 */}
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.label}>請求書番号</Text>
            <Text style={styles.value}>{invoice.invoiceNumber}</Text>
            <Text style={styles.label}>発行日</Text>
            <Text style={styles.value}>{formatDate(invoice.issueDate)}</Text>
            <Text style={styles.label}>支払期限</Text>
            <Text style={styles.value}>{formatDate(invoice.dueDate)}</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.label}>請求元</Text>
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
          <Text style={styles.label}>請求先</Text>
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
          <Text style={styles.colName}>品目</Text>
          <Text style={styles.colQty}>数量</Text>
          <Text style={styles.colPrice}>単価</Text>
          <Text style={styles.colAmount}>金額</Text>
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
            <Text style={styles.totalLabel}>小計</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>消費税（{invoice.taxRate}%）</Text>
            <Text style={styles.totalValue}>{formatCurrency(tax)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>合計</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* 振込先 */}
        {invoice.bankName && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>振込先</Text>
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
            <Text style={styles.sectionTitle}>備考</Text>
            <Text style={styles.value}>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}

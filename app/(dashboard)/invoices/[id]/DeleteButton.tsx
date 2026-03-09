"use client"

import { useRef, useState } from "react"
import { deleteInvoice } from "./actions"

interface Props {
  id: string
}

export function DeleteButton({ id }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirm("この請求書を削除してもよろしいですか？")) return

    setIsDeleting(true)
    formRef.current?.requestSubmit()
  }

  return (
    <form ref={formRef} action={deleteInvoice.bind(null, id)} onSubmit={handleSubmit}>
      <button
        type="submit"
        disabled={isDeleting}
        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {isDeleting ? "削除中..." : "削除"}
      </button>
    </form>
  )
}

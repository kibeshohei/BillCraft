"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"
import { connectDB } from "@/app/lib/db"
import User from "@/app/lib/models/User"

const RegisterSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  email: z.string().check(z.email("正しいメールアドレスを入力してください")),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
})

export type RegisterState = {
  error?: string
  success?: boolean
}

export async function register(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { name, email, password } = parsed.data

  try {
    await connectDB()

    const existing = await User.findOne({ email })
    if (existing) {
      return { error: "このメールアドレスはすでに登録されています" }
    }

    const hashed = await bcrypt.hash(password, 12)
    await User.create({ name, email, password: hashed })

    return { success: true }
  } catch {
    return { error: "登録に失敗しました。もう一度お試しください" }
  }
}

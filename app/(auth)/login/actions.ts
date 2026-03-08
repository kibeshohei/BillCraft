"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export type LoginState = {
  error?: string
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    })
    return {}
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "メールアドレスまたはパスワードが正しくありません" }
    }
    throw e
  }
}

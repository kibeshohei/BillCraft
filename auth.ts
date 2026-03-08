import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { connectDB } from "@/app/lib/db"
import User from "@/app/lib/models/User"
import { z } from "zod"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().check(z.email()),
          password: z.string().min(8),
        }).safeParse(credentials)

        if (!parsed.success) return null

        await connectDB()

        const user = await User.findOne({ email: parsed.data.email })
        if (!user) return null

        const passwordMatch = await bcrypt.compare(parsed.data.password, user.password)
        if (!passwordMatch) return null

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token.id) (session.user as { id: string }).id = token.id as string
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})
